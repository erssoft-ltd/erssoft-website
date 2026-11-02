---
title: "Does the Same Production Method Work in Every Factory?"
description: "A practical story from pipe spool manufacturing: what a Heijunka planning experiment taught me about balanced production, ERP data and real factory limits."
date: 2026-11-02
category: "ERP Consulting"
author: "ErsSoft Limited"
---

![Does the Same Production Method Work in Every Factory?](/images/insights/heijunka.webp)

*What I learned while developing an application to explore Heijunka in pipe spool production at Çimtaş Pipe.*

## A Good Idea Meets a Real Factory

A factory can be very busy and still deliver some orders late. Workers are active, machines are running and many products are waiting between production steps.

So why are deliveries delayed?

Sometimes the problem is not how much we produce. It is **what we produce first**.

When I worked at Çimtaş Pipe, the company received advice on lean manufacturing. One method we explored was **Heijunka**, a Japanese approach to making production more even over time.

The idea sounded useful. It had worked in other production environments. But pipe spool manufacturing was different.

**Could we use the same method when almost every spool needed a different amount of work?**

## Ten Spools Are Not Always the Same Work

A pipe spool can be simple or complex. One may need only a few small welds. Another may need large pipes, more welds and much more time.

In a report, both count as one spool.

Imagine that we plan to make ten spools on Monday and ten on Tuesday. The plan looks balanced. But what if Monday's spools need 30 hours of work and Tuesday's need 100 hours?

The number of spools is equal. **The workload is not.**

This was the key question for our Heijunka work: how could we spread different types of spools across a production plan more evenly?

## From an Idea to an Application

I developed an application that worked with information from our existing ERP environment.

It grouped spools by selected production details and calculated possible production sequences. We could change the order of the classification rules and compare different planning scenarios.

The application used information such as pipe sizes, weld details and estimated work for manual welding, automatic welding and fit-up (preparing parts before welding).

We did not need to enter all this information into a new system. Much of it was already available through our ERP data.

For me, the interesting part was not the application itself. It was the chance to **test a production idea against real factory information**.

## What Could Heijunka Improve?

Heijunka can help a factory avoid putting too much similar work into one part of the schedule.

For example, if many difficult welding jobs are planned together, one work area may become very busy while another has less work. A better mix of jobs may reduce these changes in workload.

A more even plan may also make it easier to organise people, machines and materials.

These are useful benefits. But there is an important difference between a plan that looks balanced on a screen and a plan that people can follow on the factory floor.

## Where Does the Method Become Difficult?

Pipe spool production has many limits that a simple balancing rule cannot solve.

A spool may be ready in the plan, but its material has not arrived. Another may need a special machine or a qualified welder. A third may have an urgent customer delivery date.

Changing the production order to create a better mix could help one work area but cause a delay somewhere else.

There is another problem: the more rules we add, the harder the planning model can become to understand and manage.

**Heijunka can support production planning. It cannot remove every production limit.**

## What the Application Could—and Could Not—Do

The application could group spools by their production features, calculate different sequences and help us compare the results. It used existing ERP information instead of creating another separate source of data.

But a balanced sequence was not the same as a complete factory schedule.

A full production plan must also consider available materials, people, machines, the order of operations and customer priorities.

The application was a way to study and support planning decisions, not a replacement for the knowledge of production planners.

## Should the Factory Follow the Method?

When a method works well in another factory, it is natural to want the same result.

But a factory making many similar products is not the same as a factory making complex spools for different projects.

This does not mean Heijunka is a bad method. It means we must ask where it helps, where it does not and what needs to change.

Sometimes we should improve the production process. Sometimes we should adapt the method. Often, we need to do both.

## The Lesson I Took Away

Today we have better ERP systems, reports and planning tools. We can build more advanced calculations than before.

But one question is still important:

**Can the factory really follow the plan we have calculated?**

My Heijunka application work at Çimtaş Pipe reminded me that a correct calculation is only one part of a good production decision.

ERP data tells us what we know. An application helps us compare options. But people who understand the factory must still consider what is possible.

**A good production plan must work in the real factory, not only on a computer screen.**

---

*This article is based on my experience developing an ERP-connected planning application for pipe spool production. It describes the approach and its limits, not measured improvements in delivery times or production costs.*
