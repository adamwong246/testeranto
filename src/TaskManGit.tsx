

import React, { useRef, useEffect, useState } from 'react';
import {
  Gitgraph,
  // GitgraphCanvas
} from '@gitgraph/react';
// import { createGitgraph, TemplateRegistry } from '@gitgraph/core';
import { Tab, Row, Col, Nav } from 'react-bootstrap';
import { NavLink, useParams } from 'react-router-dom';
import { collectionEffect } from './collectionEffect';
import { IGitGraph } from './TaskManTypes';
import { octokit } from './DELETEME';


const example = {
  "sha": "b556815e8ac2bf773b6560bd71cfd03993b85723",
  "node_id": "C_kwDOIva0UNoAKGI1NTY4MTVlOGFjMmJmNzczYjY1NjBiZDcxY2ZkMDM5OTNiODU3MjM",
  "commit": {
    "author": {
      "name": "testeranto-kokomobay",
      "email": "testeranto.kokomobay@gmail.com",
      "date": "2025-02-14T21:28:26Z"
    },
    "committer": {
      "name": "GitHub",
      "email": "noreply@github.com",
      "date": "2025-02-14T21:28:26Z"
    },
    "message": "Merge pull request #17 from ChromaPDX/gcpDeploy3\n\nupdate",
    "tree": {
      "sha": "28d012dc66fb6a8527f3c130255fe8ce5a55e3b9",
      "url": "https://api.github.com/repos/ChromaPDX/kokomoBay/git/trees/28d012dc66fb6a8527f3c130255fe8ce5a55e3b9"
    },
    "url": "https://api.github.com/repos/ChromaPDX/kokomoBay/git/commits/b556815e8ac2bf773b6560bd71cfd03993b85723",
    "comment_count": 0,
    "verification": {
      "verified": true,
      "reason": "valid",
      "signature": "-----BEGIN PGP SIGNATURE-----\n\nwsFcBAABCAAQBQJnr7V6CRC1aQ7uu5UhlAAAvZYQAIaeAcbIWvyNBIsNQRFCfNT/\nX+KMhy6XG/HFZOqDOkPzT+QMMEDDReoqd3rL3dLsd14GYmf5Gm3GTUjyWvN1ADy1\nxXtzxCJikZJeW8hgxmuK5VOSt4eietxGNSVOlsaWIISLx4SodyObPAPvvxooG5FV\n8L5u8SbChc8g+0lISrGYZCk8ZblJjpraNMUn95P5a3m7VrSiuakiHJ3v9lbz+wOF\nZ32MeqpPcDnWa2zvu5blpYvOXOnF/XbhvuNb6xOu0WcUu+aVvEMi3gwupXbsdgvo\nKYeDLVAIQGd6tL0vsdNwmPk3+OvFeGWZkHjyH6h7LeSXV55xdqo0+x7GXy/rrYI/\nETx+Pf7J9RCb4PaSZYROPl5s0y/7VSIrDXSsL+z2lXoWAb4gBWD2Fj7a9gQ/5pbq\nSMTMDPJ468s+oyLMQIYPgSc+kP3mouAxxuIoJFJpnNeScyp5OMkhquSBgmuwTUMk\n2KaUaj9q7tywMIQiYO2dgHUyfoYi8WHAbjKNopHBsMA9pJhmNmAZv9K70pBHkMQj\nqKQ9JnxFAQU0dWyWsv7TvLIwwEyxwsxHIFxSrOzs05aYXFov+BZSDgMKG2pL5oeO\n4SPb2QaO64dnkGv/sjUqRAN/hN3C3aNsCSPT0QdKIwGwXRM16DNHY4LzdAlG+gr5\ns+buSzfdhmj6894f+nVc\n=QzBs\n-----END PGP SIGNATURE-----\n",
      "payload": "tree 28d012dc66fb6a8527f3c130255fe8ce5a55e3b9\nparent 7c2416df327776a9ed6931609f4796eaf8bb03c9\nparent e4f52df814785f68509ed2e1a71d365706e6956e\nauthor testeranto-kokomobay <testeranto.kokomobay@gmail.com> 1739568506 -0800\ncommitter GitHub <noreply@github.com> 1739568506 -0800\n\nMerge pull request #17 from ChromaPDX/gcpDeploy3\n\nupdate",
      "verified_at": "2025-02-14T21:32:46Z"
    }
  },
  "url": "https://api.github.com/repos/ChromaPDX/kokomoBay/commits/b556815e8ac2bf773b6560bd71cfd03993b85723",
  "html_url": "https://github.com/ChromaPDX/kokomoBay/commit/b556815e8ac2bf773b6560bd71cfd03993b85723",
  "comments_url": "https://api.github.com/repos/ChromaPDX/kokomoBay/commits/b556815e8ac2bf773b6560bd71cfd03993b85723/comments",
  "author": {
    "login": "testeranto-kokomobay",
    "id": 199287859,
    "node_id": "U_kgDOC-DkMw",
    "avatar_url": "https://avatars.githubusercontent.com/u/199287859?v=4",
    "gravatar_id": "",
    "url": "https://api.github.com/users/testeranto-kokomobay",
    "html_url": "https://github.com/testeranto-kokomobay",
    "followers_url": "https://api.github.com/users/testeranto-kokomobay/followers",
    "following_url": "https://api.github.com/users/testeranto-kokomobay/following{/other_user}",
    "gists_url": "https://api.github.com/users/testeranto-kokomobay/gists{/gist_id}",
    "starred_url": "https://api.github.com/users/testeranto-kokomobay/starred{/owner}{/repo}",
    "subscriptions_url": "https://api.github.com/users/testeranto-kokomobay/subscriptions",
    "organizations_url": "https://api.github.com/users/testeranto-kokomobay/orgs",
    "repos_url": "https://api.github.com/users/testeranto-kokomobay/repos",
    "events_url": "https://api.github.com/users/testeranto-kokomobay/events{/privacy}",
    "received_events_url": "https://api.github.com/users/testeranto-kokomobay/received_events",
    "type": "User",
    "user_view_type": "public",
    "site_admin": false
  },
  "committer": {
    "login": "web-flow",
    "id": 19864447,
    "node_id": "MDQ6VXNlcjE5ODY0NDQ3",
    "avatar_url": "https://avatars.githubusercontent.com/u/19864447?v=4",
    "gravatar_id": "",
    "url": "https://api.github.com/users/web-flow",
    "html_url": "https://github.com/web-flow",
    "followers_url": "https://api.github.com/users/web-flow/followers",
    "following_url": "https://api.github.com/users/web-flow/following{/other_user}",
    "gists_url": "https://api.github.com/users/web-flow/gists{/gist_id}",
    "starred_url": "https://api.github.com/users/web-flow/starred{/owner}{/repo}",
    "subscriptions_url": "https://api.github.com/users/web-flow/subscriptions",
    "organizations_url": "https://api.github.com/users/web-flow/orgs",
    "repos_url": "https://api.github.com/users/web-flow/repos",
    "events_url": "https://api.github.com/users/web-flow/events{/privacy}",
    "received_events_url": "https://api.github.com/users/web-flow/received_events",
    "type": "User",
    "user_view_type": "public",
    "site_admin": false
  },
  "parents": [
    {
      "sha": "7c2416df327776a9ed6931609f4796eaf8bb03c9",
      "url": "https://api.github.com/repos/ChromaPDX/kokomoBay/commits/7c2416df327776a9ed6931609f4796eaf8bb03c9",
      "html_url": "https://github.com/ChromaPDX/kokomoBay/commit/7c2416df327776a9ed6931609f4796eaf8bb03c9"
    },
    {
      "sha": "e4f52df814785f68509ed2e1a71d365706e6956e",
      "url": "https://api.github.com/repos/ChromaPDX/kokomoBay/commits/e4f52df814785f68509ed2e1a71d365706e6956e",
      "html_url": "https://github.com/ChromaPDX/kokomoBay/commit/e4f52df814785f68509ed2e1a71d365706e6956e"
    }
  ]
}

const simpleGraph = [
  {
    refs: ["HEAD", "feat1"],
    hash: "5d8e7d7f6b4cf520b4ec55a0face7c07b4d642c1",
    hashAbbrev: "5d8e7d7",
    tree: "4b825dc642cb6eb9a060e54bf8d69288fbee4904",
    treeAbbrev: "4b825dc",
    parents: ["0df8d7cce68908571cd7cd9178e498f1519de77e"],
    parentsAbbrev: ["0df8d7c"],
    author: {
      name: "Nicolas Carlo",
      email: "nicolas.carlo@busbud.com",
      timestamp: 1532021290000,
    },
    committer: {
      name: "Nicolas Carlo",
      email: "nicolas.carlo@busbud.com",
      timestamp: 1532021290000,
    },
    subject: "third",
    body: "",
    notes: "",
    stats: [],
  },
  {
    refs: ["master"],
    hash: "5e5b104afddb719d02b6d685463dd38b4dd82493",
    hashAbbrev: "5e5b104",
    tree: "4b825dc642cb6eb9a060e54bf8d69288fbee4904",
    treeAbbrev: "4b825dc",
    parents: ["0df8d7cce68908571cd7cd9178e498f1519de77e"],
    parentsAbbrev: ["0df8d7c"],
    author: {
      name: "Nicolas Carlo",
      email: "nicolas.carlo@busbud.com",
      timestamp: 1532021274000,
    },
    committer: {
      name: "Nicolas Carlo",
      email: "nicolas.carlo@busbud.com",
      timestamp: 1532021274000,
    },
    subject: "second",
    body: "",
    notes: "",
    stats: [],
  },
  {
    refs: [],
    hash: "0df8d7cce68908571cd7cd9178e498f1519de77e",
    hashAbbrev: "0df8d7c",
    tree: "4b825dc642cb6eb9a060e54bf8d69288fbee4904",
    treeAbbrev: "4b825dc",
    parents: [],
    parentsAbbrev: [],
    author: {
      name: "Nicolas Carlo",
      email: "nicolas.carlo@busbud.com",
      timestamp: 1532021230000,
    },
    committer: {
      name: "Nicolas Carlo",
      email: "nicolas.carlo@busbud.com",
      timestamp: 1532021230000,
    },
    subject: "first",
    body: "",
    notes: "",
    stats: [],
  },
];

export const Git = ({
  adminMode
}: {

  adminMode
}) => {

  const { id } = useParams();

  const [gitTree, setCommits] = useState<{
    branches: {
      commit: {
        sha: string;
      },
      name: string;
    },
    commits: {
      refs: string[],
      sha: string,
      node_id: string
      "commit": {
        "author": {
          "name": string,
          "email": string,
          "date": string
        },
        "committer": {
          "name": string,
          "email": string,
          "date": string
        },
        "message": string,
        "tree": {
          "sha": string,
          // "url": "https://api.github.com/repos/ChromaPDX/kokomoBay/git/trees/28d012dc66fb6a8527f3c130255fe8ce5a55e3b9"
        },

      }
      parents: {
        "sha": string,
        "url": string,
        "html_url": string,
      }[],
    }[]
  }>({ commits: [], branches: [] });

  useEffect(() => {
    (async () => {
      octokit
      const { data: commits } = await octokit.rest.repos.listCommits({
        owner: "ChromaPDX",
        repo: "kokomoBay"
      });


      const { data: branches } = await octokit.rest.repos.listBranches({
        owner: "ChromaPDX",
        repo: "kokomoBay",
      });
      console.log("branches", branches)

      console.log("commits", commits)
      setCommits({ branches, commits });


    })();
  }, []);

  console.log("gitTree", gitTree)
  const fancyCommits = !gitTree.commits ? [] : gitTree.commits.map((c) => {

    return {
      // refs: c.parents.map((p) => p.sha),
      refs: gitTree.branches.filter((b) => b.commit.sha === c.sha).map((b) => b.name),
      hash: c.sha,
      hashAbbrev: c.sha.slice(0, 7),
      tree: c.node_id,
      treeAbbrev: c.node_id.slice(0, 7),
      parents: c.parents.map((p) => p.sha),
      parentsAbbrev: c.parents.map((p) => p.sha.slice(0, 7)),
      author: {
        name: c.commit.author.name,
        email: c.commit.author.email,
        timestamp: new Date(c.commit.author.date).getMilliseconds(),
      },
      committer: {
        name: c.commit.committer.name,
        email: c.commit.committer.email,
        timestamp: new Date(c.commit.committer.date).getMilliseconds(),
      },
      subject: c.commit.message,
      body: "",
      notes: "",
      stats: [],
    }
  });

  console.log("simpleGraph", simpleGraph)
  console.log("fancyCommits!", fancyCommits)

  if (!adminMode) return <Tab.Container id="left-tabs-example5" defaultActiveKey="feature-0">
    <Row>
      <Col sm={3}>
        <Nav variant="pills" className="flex-column">

          <Nav.Item>
            <NavLink
              to={`/commit/idk`}
              className="nav-link"
            >
              ChromaPDX/kokomoBay
            </NavLink>
          </Nav.Item>

          {/* {(gitTree.commits).map((c, ndx) =>
            <Nav.Item>
              <NavLink
                to={`/commit/${c.sha}`}
                className="nav-link"
              >
                {c.sha}
              </NavLink>
            </Nav.Item>
          )} */}
        </Nav>
      </Col>
      <Col sm={9}>
        <Tab.Content>
          {fancyCommits.length && <Gitgraph
          >
            {(gitgraph) => {
              gitgraph.import(fancyCommits);
            }}
          </Gitgraph>}

        </Tab.Content>
      </Col>

    </Row>
  </Tab.Container>;



  return <div></div>
};
