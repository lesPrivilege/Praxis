import assert from 'node:assert/strict';
import {EVENTS,REPLAY,fold,atStage,project,movieAt} from './model.mjs';
const checks=[];
function test(name,fn){fn();checks.push({name,result:'passed'});}
test('提议追加日志但不改变期限和版本',()=>{const m=atStage(1);assert.equal(m.log.length,2);assert.equal(m.version,1);assert.equal(m.state.term,'12 个月');});
test('批准生效并提升版本',()=>{const m=atStage(2);assert.equal(m.version,2);assert.equal(m.state.term,'24 个月');});
test('拒绝保留历史，不改变付款',()=>{const m=atStage(4);assert.equal(m.log.length,5);assert.equal(m.version,2);assert.equal(m.state.payment,'按季度');assert.equal(m.candidates['cand-04'].status,'rejected');});
test('投影只选对方和期限，并保留依据',()=>{const m=atStage(5);assert.deepEqual(Object.keys(m.context.values),['counterparty','term']);assert.equal(m.context.basis,2);assert.equal(m.context.current,true);});
test('修正状态，不改写旧上下文；整体版本过期',()=>{const m=atStage(6);assert.equal(m.state.payment,'按月');assert.equal(m.version,3);assert.equal(m.context.basis,2);assert.equal(m.context.current,false);});
test('重放同 ID 不追加或再次批准',()=>{const m=atStage(7);assert.equal(m.log.length,6);assert.equal(m.version,3);assert.equal(m.replayCount,1);assert.deepEqual(fold([...EVENTS,REPLAY]).state,fold(EVENTS).state);});
test('最终值与原 fixture 预期一致（匿名化对方）',()=>assert.deepEqual(atStage(8).state,{counterparty:'示例公司',term:'24 个月',payment:'按月',status:'审阅中'}));
test('ctx-B 付款与证据，期限仍在状态',()=>{const m=atStage(8);assert.equal(m.context.current,true);assert.equal(m.context.values.payment,'按月');assert.equal(m.context.evidence,'src-contract-v3');assert.equal(m.context.values.term,undefined);assert.equal(m.state.term,'24 个月');});
test('反复投影不修改输入状态',()=>{const m=atStage(8),before=JSON.stringify(m);for(let i=0;i<20;i++)project(m,i%2?['term']:['payment'],'test','test');assert.equal(JSON.stringify(m),before);});
test('未找到候选的批准显式报错',()=>assert.throws(()=>fold([EVENTS[2]]),/待审候选/));
test('未知事件类型显式报错',()=>assert.throws(()=>fold([{id:'invalid',kind:'unknown'}]),/未知事件类型/));
test('任意顺序 seek 同一时刻语义一致',()=>{const times=[0,12,18,28,31,38,49,59,68,82];const expected=times.map(t=>JSON.stringify(movieAt(t)));for(const t of [...times].reverse())assert.equal(JSON.stringify(movieAt(t)),expected[times.indexOf(t)]);});
test('教学公式不提前显示尚未发生的事件',()=>{assert.ok(!movieAt(8).beat.formula.includes('e₂'));assert.ok(movieAt(12).beat.formula.includes('e₂'));assert.ok(!movieAt(28).beat.formula.includes('e₅'));assert.ok(movieAt(31).beat.formula.includes('e₅'));});
process.stdout.write(JSON.stringify({fixture:'a3-esc-001',checks,passed:checks.length},null,2)+'\n');
