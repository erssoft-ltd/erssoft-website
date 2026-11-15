---
title: "Does Producing More Spools Mean More Shipments?"
description: "How scenario-based MRP helped teams plan spool production and shipment crates in General Electric projects."
date: 2026-11-15
category: "ERP Consulting"
author: "ErsSoft Limited"
---

![Does Producing More Spools Mean More Shipments?](/images/insights/scenario-based-shipment-oriented-mrp-planning.webp)

*An example of scenario-based, shipment-focused MRP planning from our work on General Electric (GE) projects.*

## Production Is Moving. But Are Shipments Ready?

In large pipe fabrication projects, teams often measure progress by the number of finished spools. But more finished spools do not always mean more shipments.

Spools can belong to different shipping crates. A crate is ready to ship only when all its required spools are complete and the other shipment requirements are met.

Imagine a crate with ten spools. Materials are available for nine of them, but one spool needs a part that is missing. The nine spools may be produced, but the crate still cannot be shipped.

Some of the materials used for those nine spools might also help complete another crate.

**So what should we plan first: more individual spools, or more complete shipping crates?**

This was an important question behind an ERP-based MRP planning solution we developed while working on GE projects.

## The Problem Is Not Always a Lack of Materials

The same pipes, fittings and other materials can be needed by spools in different crates. How these materials are planned can be as important as how much stock is available.

If one spool cannot be made, keeping materials for the other spools in its crate may stop another crate from being completed.

However, some crates are critical. Even when a few materials are missing, the team may need to keep existing material allocations and move forward with the work that is possible.

**One planning rule cannot always meet both needs.** We needed a way to test different plans before making changes in the real ERP system.

## Choose a Scenario Before Running MRP

Our solution used different planning scenarios. Before running the program, the user selected the rules for crate checks and spool checks.

The scenarios helped answer different questions:

- **Crate check:** Which complete crates could be made with the available materials?
- **Spool check:** If a crate could not be completed, which of its spools could still be made, and what materials were missing?

There was one important point: **the MRP program did not allocate materials in the real ERP system.**

It read the stock position at that time and tested material use inside its own calculation. We can call these *virtual allocations*. Releasing a virtual allocation made the material available for another calculation; it did not change a real stock reservation.

## How the Crate-Based Algorithm Worked

For the crate-check scenario, the goal was to find crates that could be fully produced with the available materials.

The program sorted crates by planned shipment date, starting with the earliest. It then checked the first spool in the first crate.

If all materials for that spool were available, the program allocated them **virtually** and moved to the next spool in the same crate.

If a spool had a missing material, the program released all virtual allocations made for that crate. It marked the crate as not fully producible and moved to the next crate.

If every spool passed the check, the crate was marked as producible. Its virtual allocations stayed in the calculation, so the same stock would not be counted again for another crate.

### Simplified algorithm

```text
1. Sort crates by planned shipment date.

2. For each crate:
   - Check its spools one by one.
   - If a spool has all required materials:
       Allocate those materials virtually.
       Check the next spool.
   - If a spool has a missing material:
       Release the crate's virtual allocations.
       Mark the crate as not fully producible.
       Move to the next crate.
   - If all spools pass:
       Mark the crate as producible.
       Keep its virtual allocations in the plan.

3. Prepare the scenario result report.
```

The main rule was simple: **either the whole crate passed the material check, or its virtual allocations were released.**

## A Simple Example: Two Crates

*The dates and quantities in this example are for illustration only.*

**Crate A** has ten spools and a planned shipment date of 20 November. The tenth spool needs a special part that is not in stock.

**Crate B** has eight spools and a planned shipment date of 22 November. Some of its spools need materials that are also used in Crate A.

The MRP program checks Crate A first. It can virtually allocate materials for the first nine spools, but it finds a shortage at spool ten.

The program then releases Crate A's virtual allocations and checks Crate B. If all eight spools in Crate B can be made with the available stock, Crate B is shown as producible in the report.

This does not mean Crate A is no longer important. It means the report shows what is possible with the stock available at that moment.

**No real ERP material allocations are changed by this test.**

## Critical Crates Needed a Different Rule

Not every crate could wait until all materials were available.

Some crates had a high priority because of project or shipment needs. For these cases, the planning scenario could run without the full crate check.

When the crate check was not used, the program did not disturb materials already allocated to spools in the real ERP system. The team could continue work on the possible spools while missing materials were followed up and allocated as soon as they became available.

This gave the planning team flexibility: use the full-crate rule when complete shipments were the main goal, or protect important ongoing work when a crate was critical.

## Spool Checks and the Missing Materials Report

After the first crate-based result, the program could examine crates that had not passed the full-crate check.

This time, the aim was different. Instead of asking whether **every** spool in a crate could be made, it asked how many spools could be made with the available materials.

The program checked spools one by one. If a spool had all its materials, its virtual allocation stayed in the calculation. If a spool had a shortage, only that spool's virtual allocations were released. The program then continued with other spools in the same crate.

This meant one incomplete spool did not stop the program from checking the rest of the crate.

The algorithm could then be run again for the spools that were still not producible. The result was a **missing materials report** showing which materials were needed for the remaining spools, and therefore what was still needed to complete the crate.

For example, if eight of ten spools could be made, the report could focus on the missing materials for the other two, rather than treating all ten spools as unavailable.

This helped the teams understand both what could move forward and what still needed attention.

## From MRP Report to Real Production

The MRP program was a **decision-support tool**, not an automatic production release system.

After the selected scenario finished, it produced a report for the work preparation and planning teams. The report showed which crates and spools were possible under the selected rules, and which materials were missing.

The **work preparation team** reviewed the report and made the actual material allocations in the real ERP system. The work preparation and **planning teams** then worked together to release the fabrication work to production.

The process had three clear steps:

1. **MRP analysis:** Test material availability using a selected scenario, without changing real allocations.
2. **Work preparation:** Review the report and make real material allocations in ERP.
3. **Production release:** Work with the planning team to move the selected fabrication work into production.

The report was a picture of stock at the time it was run. If new materials arrived or stock allocations changed, the program needed to be run again to provide an updated result. A missing part arriving did not automatically make the whole crate possible: other materials might no longer be available.

## What Made This Different from a Standard MRP Check?

Traditional MRP helps teams understand what materials are needed, how much is needed and when they are needed.

Our solution added practical questions linked to shipment crates:

- Can we make every spool in this crate?
- If not, could the same available stock help complete another crate?
- Should existing allocations be protected for a critical crate?
- Which spools in an incomplete crate can still be made?
- What materials are missing from the remaining spools?

The approach can be described as **Scenario-Based, Shipment-Oriented MRP Planning**.

It was not a mathematical optimisation system that tested every possible stock combination or guaranteed the highest number of completed crates. It was a practical way to check shipment priorities and material availability, then give useful information to the people making production decisions.

## The Value of ERP Is Better Decisions

The solution aimed to support four important needs: clear shipment priorities, better use of available materials, visibility of shortages, and controlled production decisions.

Its value was not in changing stock automatically. It was in showing the likely result of a planning choice **before** the team made real material allocations.

Sometimes the best plan is to focus on complete crates. Sometimes a critical crate needs special attention. Sometimes the right next step is to make the possible spools and report what is still missing.

**Good production planning is not only about how much we can make. It is about what we should make, when we should make it, and why.**
