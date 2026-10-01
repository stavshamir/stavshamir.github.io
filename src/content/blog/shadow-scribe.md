---
title: "Shadow Scribe"
heroImage: "../../assets/blog/shadow-scribe-banner.jpg"
description: "A Cursor skill that turns agent transcripts into a structured developer journal, run from a second shadow chat."
pubDate: 2026-09-30
---

> **TL;DR:** For five months, I've been keeping a developer journal, now over 100 entries. Of course, I haven't written a word of it - a single skill generates it for me. The journal helps me remember what I worked on and why I made the decisions I did, gives my agents context, and unblocks my colleagues when I'm not around. The skill is [on GitHub](https://github.com/stavshamir/shadow-scribe), ready to use; the [workflow](#the-workflow) section is all you need to get started.

Every developer knows that moment: a colleague asks you "why did you build it this way?" or "where is the script you used to clean the environment last time?" The answer is frustratingly on the tip of your tongue; you are working on so many things, and you are less organized than you would like. You just don't remember.

The solution was always there. The web is full of posts by those better than us, maintaining developer journals and orchestrating their second brains. I tried materializing the promise of this approach for many years, ending with a graveyard of nearly-empty Obsidian vaults and just my lonely, single brain.

<img src="/blog/shadow-scribe/second-brain-meme.png" width="242" alt="Meme: a relaxed character lounging in a giant brain, captioned “Just write a second brain bro”">

AI made it worse. We work on far more things at once, leaving behind an ephemeral, disorganized trail:

- Agent-generated ad-hoc scripts and artifacts
- Agent insights we have to re-explain over and over
- The rationale behind the decisions we make, and the alternatives we ruled out

So much more to forget. Our defense is hoarding: a sidebar of ever-mounting sessions we never archive - kept in case we need what's buried in them (and never find it when we do).

But the same shift that made this worse is what makes it fixable. Nearly all my work runs through Cursor, so a complete, raw log of it already exists - the transcripts. All that's left is to distill them into structured entries: the developer journal I could never keep.

This post describes the current shape of my solution, after 5 months and over 100 entries - a single skill, invoked using "shadow" sessions, which allows you to keep an organized journal of your work with minimal effort.

## The workflow

The setup has two parts. A skill, `scribe`,  that does the heavy lifting: it reads a session's transcript and distills it into a journal entry. A **shadow session** is where I run it: a second chat that follows a working session's transcript and does its own work with it. Here that work is journaling.

1. I start working on a task as usual.
2. After a few turns, I open a new chat as the shadow session and run `/scribe @<working-session>`. `scribe` reads the transcript and writes the first entry.
3. I rename the shadow session `<working-session> [scribe]` so it's obvious which shadow belongs to which working session.
4. At natural stopping points, I type `checkpoint`. `scribe` rewrites the entry and copies any plans, scripts or other artifacts the agent produced into `artifacts/`, linked from the entry.
5. When the task is done, I archive both sessions. The entry has everything I need, so there's no reason to hoard sessions. The sidebar holds only work in progress.

<figure>
<img src="/blog/shadow-scribe/sidebar.png" width="300" alt="Cursor sidebar showing two working sessions, each next to its [scribe] shadow session">
<figcaption>Two tasks in progress, each working session paired with its scribe shadow.</figcaption>
</figure>

> **Run `scribe` in its own session.** That keeps the working agent's context dedicated to the task and lets me checkpoint while it's still working. Inside the working session, journaling would eat into its context and interrupt the work.

More than one working session can be followed: in the shadow session, I can type `attach` and mention another session. I can also tell the shadow session things the transcript doesn't show, like a decision made in a meeting, and it adds them to the entry. Entries get tags suggested from a fixed vocabulary maintained in a `tags.yaml` file (and when nothing fits, it proposes new ones). Approving the suggested tags is the only thing `scribe` asks me about. 

## Example entry

Here's what an entry looks like:
<img class="zoomable" src="/blog/shadow-scribe/example-entry.png" width="490" alt="An example journal entry with Goal, Background, Outcomes, Decisions, Insights and References sections">

This one is made up, but it has the same structure as the real entries the skill writes.

The first three sections get me oriented in seconds:

- **Goal** states the purpose of the work in one sentence.
- **Background** explains why the work was needed.
- **Outcomes** record what is now true.

The last three address the problems I started with:

- **Decisions** record what was decided, why, and which alternatives were ruled out.
- **Insights** save future agents from repeating expensive exploration, and save me from answering the same questions again.
- **References** link straight to the plan, the PR, and the load test script created during the work.

When work is still in progress, the entry also gets a **Handoff** section listing what's still open: blockers, risks, and unanswered questions.

## Using the journal

I use the journal in three ways:

- **For me.** I browse it in Obsidian, though any markdown reader works. When I want to remember something I worked on, I search by tag or keyword. When I come back to an unfinished task after lunch or the next morning, the Goal, Background, Outcomes and Handoff sections let me quickly rebuild its context.
- **For my agents.** The journal lives in the same folder as all my repos, so agents can search it like any other file. When I start a new task, I either point the agent at the entries I know are relevant or let it find them itself.
- **For my colleagues.** When someone asks about something I worked on, I look it up and dazzle them with my suddenly excellent memory, or send them the whole entry.

The last one got its real test when I went on a two-week vacation in the middle of a big feature. I didn't want anyone blocked on questions only I could answer, so I built a small skill that let my colleagues' agents answer questions about my work straight from the journal. Some of them kept using that skill even after I returned.

My favorite moment came a few weeks later, in a Slack thread I happened to see. Three teammates were stuck on a failing request and couldn't agree on what an API expected. One of them linked my journal entry as the answer. Another wasn't sure how precise a summary could be. After two hours of back-and-forth, the thread ended with: "Turns out Stav's summary wasn't wrong."

The answer had been sitting in the entry's Insights section. It was exactly the kind of non-obvious detail that's cheap to write down while the work is fresh and expensive to rediscover later.

## How it works

`scribe` relies on the fact that Cursor, like other agent harnesses, saves every chat's transcript to disk as a `jsonl` file. When a working session is mentioned in the `scribe` invocation, its transcript path is resolved. A small deterministic helper script compacts the transcript: it keeps everything the agent and I wrote, word for word, but reduces each tool call to a one-line summary of the file it read or the command it ran, without file contents or diffs. That shrinks the transcript by roughly 35%, and the compacted version is what the skill reads.

On every `checkpoint`, the transcript is read from where the last one stopped, so only new turns are read. The entry is rewritten from scratch, keeping established facts, but rewording as needed. That's what keeps an entry from turning into a running log of events. When the goal shifts halfway through a working session, the Goal section changes with it. If an early assumption turns out wrong, the entry records the correction, not both versions. This is also when artifacts are copied into the `artifacts/` dir and linked from the References section.

<img class="zoomable" src="/blog/shadow-scribe/data-flow.png" alt="Diagram: working sessions write transcripts and create artifacts; the shadow session reads both, copies the artifacts to the vault and writes the journal entry">

The entry's structure is determined by a template defined in the skill and a set of instructions and anti-instructions, all highly opinionated. I have tweaked them many times to get to a result I was satisfied with, but two principles have held throughout.

The first is that entries are written for humans and agents alike. Many memory approaches optimize only for agents, producing files that a person would never want to read. A journal entry has to work for both: a human should get the gist from the title, Goal and Outcomes in under a minute, and an agent should find the reasoning under explicit labels like **Why** and **Rejected** instead of buried in prose.

The second is about what to keep. An entry keeps what is expensive to rediscover: the reasons behind decisions, the alternatives that lost, and anything that surprised us along the way. It leaves out what other systems already track, like commits, PR status and test runs. They're noise in a journal, and a copy in the entry would go stale anyway.

## Wrapping up

The whole habit costs me a second chat and a few commands. By my rough estimate, a shadow session uses about one token for every seven the working session spends.

The shadow session is the part I'd most like others to steal. Journaling is just one thing you can do with a live transcript and a separate context. A shadow could review the work as it happens and flag when the agent drifts from the plan or ignores a correction. It could notice when I correct the agent the same way twice and propose rules and skills. Meanwhile, the working session stays focused on the task, and the shadow does its job without adding a single token to it.

The skill is available on GitHub:

<a class="repo-card" href="https://github.com/stavshamir/shadow-scribe">
<svg viewBox="0 0 16 16" aria-hidden="true" width="32" height="32"><path fill="currentColor" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"></path></svg>
<span class="repo-card-text"><strong>stavshamir/shadow-scribe</strong><span>The scribe skill and its helper scripts</span></span>
</a>

It's opinionated by design, so treat it as a starting point. The template and the rules about what to keep are plain instructions you can change to fit how you work. It's built around Cursor, but only the small helper scripts that find and compact transcripts depend on that. Other harnesses save transcripts too, so porting it mostly means teaching those scripts a new location and format.

These days, when a colleague asks me "why did you build it this way?", I still don't remember. I just calmly open the journal.