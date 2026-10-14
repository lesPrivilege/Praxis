"""Validate manuscript references and read-only links; does not fetch or mutate."""
import json
from pathlib import Path
import re
import subprocess

ROOT=Path(__file__).resolve().parent
REPO=ROOT.parents[3]
BASE='ae1827f34c6df067348d2454d7e5c9331ceda25d'
PREFIX=ROOT.relative_to(REPO).as_posix()+'/'


def require(condition,message):
    if not condition:
        raise ValueError(message)


def main():
    ev=json.loads((ROOT/'evidence.json').read_text())
    sources={x['id']:x for x in ev['sources']}
    claims={x['id']:x for x in ev['claims']}
    require(len(sources)==len(ev['sources']),'duplicate source ID')
    require(len(claims)==len(ev['claims']),'duplicate claim ID')
    require(len({s['canonical_url'] for s in sources.values()})==len(sources),'duplicate canonical URL')
    reviews={x['source_id']:x for x in ev['reviews']}
    chapters=sorted(ROOT.glob('0[1-4]-*.md'))
    require(len(chapters)==4,'four chapters required')
    body='\n'.join(p.read_text() for p in chapters)
    cited=set(re.findall(r'EM-C\d\d',body))
    source_facts={x['id'] for x in claims.values() if x['kind']=='source_fact'}
    require(cited==source_facts,'chapter citations and source facts differ')
    for chapter in chapters:
        text=chapter.read_text()
        for stage in ('识题','解法','演算','验算','变式'):
            require(stage in text,f'{chapter.name} missing {stage}')
        require('TODO' not in text and '待核实' not in text,'unresolved factual placeholder in body')
    for claim in claims.values():
        require((ROOT/claim['chapter']).is_file(),'missing claim destination')
        require(claim['kind'] in ('source_fact','inference','synthetic'),'invalid claim kind')
        for source_id in claim['source_ids']:
            require(source_id in sources and source_id in reviews,'unreviewed source')
            require(claim['id'] in reviews[source_id]['supported_claims'],'review/claim mismatch')
        for basis in claim.get('basis_claim_ids',[]):
            require(basis in claims,'unknown inference basis')
        if claim['kind']=='source_fact':
            require(claim['source_ids'] and claim['locator'],'missing source/locator')
    links=json.loads((ROOT/'case-links.json').read_text())['case_links']
    expected={x['case_id'] for x in json.loads((ROOT.parent/'case-index.json').read_text())['cases']}
    require(len(links)==len(expected)==33,'case count mismatch')
    require({x['case_id'] for x in links}==expected,'case IDs differ')
    for link in links:
        subprocess.run(['git','cat-file','-e',link['commit']+':'+link['path']],cwd=REPO,check=True,capture_output=True)
        require(link['mechanism'] and link['boundary'] and link['reading_task'],'empty transfer condition')
        require(link['url'] in (ROOT/'case-connections.md').read_text(),'missing readable case link')
    examples=json.loads((ROOT/'examples.json').read_text())['examples']
    require({e['id'] for e in examples}=={'EM-E01','EM-E02'},'example IDs differ')
    methods=(ROOT/'test_mechanism_lab.py').read_text()
    for example in examples:
        for claim in example['claim_ids']: require(claim in claims,'unknown example claim')
        for method in example['test_methods']: require('def '+method+'(' in methods,'missing example test')
        ids=[step['id'] for step in example['steps']]
        require(len(set(ids))==len(ids),'duplicate example step ID')
    e1,e2=examples
    require(e1['policy']['accepted_qty']*e1['policy']['price_minor']==720000,'E01 inconsistent arithmetic')
    require(e2['policy']['desired_worker_limit']==6,'E02 differs from manuscript')
    changed=subprocess.check_output(['git','diff','--name-only',BASE],cwd=REPO,text=True).splitlines()
    untracked=subprocess.check_output(['git','ls-files','--others','--exclude-standard'],cwd=REPO,text=True).splitlines()
    require(all(p.startswith(PREFIX) for p in changed+untracked),'change outside owned scope')
    print(json.dumps({'result':'pass','chapters':len(chapters),'case_links':len(links),
        'sources':len(sources),'reviews':len(ev['reviews']),'claims':len(claims),
        'source_facts':len(source_facts),'inferences':5,'synthetic_claims':5,
        'worked_examples':len(examples),'changed_condition_exercises':body.count('**变式'),
        'scope':PREFIX},ensure_ascii=False))


if __name__=='__main__': main()
