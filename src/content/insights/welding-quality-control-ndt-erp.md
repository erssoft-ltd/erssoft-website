---
title: "Should Production Pressure Influence Welding Quality Control?"
description: "An ERP-based approach to improving welding quality in spool fabrication through line-based RT requirements and FIFO inspection requests."
date: 2026-11-25
category: "ERP Consulting"
author: "ErsSoft Limited"
---

![An ERP-based NDT management approach to improving welding quality in spool fabrication.](/images/insights/welding-quality-control-ndt-erp.webp)

## 1. Can Welding Quality Be Achieved Through Inspection Alone?

In industrial piping and spool fabrication, welding quality is very important for project safety, reliability and long-term success.

The production department is responsible for completing fabrication. The planning department is responsible for meeting delivery dates. The quality control department makes sure that the work meets project requirements.

All these departments share the same goal: completing the project successfully. However, when shipment dates get closer, there can be pressure to increase production speed while maintaining quality.

During my experience in spool fabrication and ERP management, I asked myself an important question:

**Can we make quality control decisions as independent as possible from production and shipment pressure?**

Based on this question, I developed an ERP application to manage radiographic testing requests.

My aim was not only to automate quality control. I also wanted to create a process that could help improve welding quality.

## 2. What Is NDT?

NDT stands for Non-Destructive Testing. It is the general name for methods used to inspect materials and welds without damaging them.

The main NDT methods used in industrial spool fabrication include:

- **RT – Radiographic Testing:** Inspection using radiation to examine the internal condition of a weld.
- **PT – Penetrant Testing:** Inspection using a liquid penetrant to find surface defects.
- **MT – Magnetic Particle Testing:** Inspection using magnetic particles.
- **UT – Ultrasonic Testing:** Inspection using sound waves.

The inspection methods, inspection requirements and acceptance criteria depend on the relevant standards and project requirements.

Each piping line can have its own quality control requirements. Some lines require radiographic testing of a certain percentage of welds, while others require 100% inspection.

In this article, I focus on how radiographic testing (RT) requests were selected and managed through ERP.

## 3. What Happens When a Weld Does Not Pass Inspection?

When radiographic testing shows that a weld does not meet the acceptance criteria, the weld is repaired and inspected again.

However, quality management is not only about repairing a failed weld. Other welds completed by the same welder may also need inspection.

Under the quality control rules used in the projects I worked on:

- The failed weld was repaired and inspected again.
- The next two welds completed by the same welder received additional radiographic testing.
- If one of these welds also failed, the inspection requirements could be increased.
- When necessary, the welder's work could be subject to 100% inspection for a certain period.

These rules can vary depending on the relevant standards and project requirements.

The aim is not only to find existing welding defects, but also to identify possible quality problems early and keep welding quality under control.

## 4. The Challenges of Manual RT Management

In the early days, NDT operators manually decided which welds needed radiographic testing.

They reviewed the number of completed welds, the number of welds already inspected and the required inspection percentage for each line.

However, depending heavily on manual decisions created some challenges:

- Inspections were not always evenly spread throughout production.
- Monitoring the inspection percentage for each line took time.
- Personal judgement could influence weld selection.
- Production and shipment priorities could influence quality control decisions.

Meeting the required RT percentage by the end of fabrication was important. However, I also believed that the timing and distribution of inspections were equally important.

Completing the required inspections near the end of fabrication is different from inspecting welds at regular intervals from the beginning.

The second approach can help identify quality problems earlier.

For this reason, I wanted to develop a more systematic, objective and reliable decision-making process.

## 5. Two Different Approaches to Radiographic Testing

When developing the application, I considered two different methods.

### Method 1: Selecting Welds Before Fabrication

In this method, the welds requiring radiographic testing are selected before the spools are released to fabrication.

This approach has important advantages. The planning department can plan NDT activities together with welding activities. It is easier to manage the NDT workload, staffing, equipment and production schedule.

However, I believed that this method could also create a quality management risk.

Even if welders do not know which welds will be inspected, planning engineers or NDT supervisors may have this information.

When urgent shipments need to be completed, knowing in advance which welds will not receive radiographic testing could influence production decisions. This creates a risk that the information could be misused.

The issue is not whether we trust employees. It is about reducing risks created by the design of the process.

A well-designed quality management system should remain reliable even under operational pressure.

### Method 2: Selecting Welds After Welding Is Completed

This was the method I chose.

Under this approach, welds requiring percentage-based radiographic testing were not selected before fabrication.

After a weld was completed, the ERP algorithm checked the inspection requirements of its piping line and decided whether an RT request was needed.

The decision was based on actual production progress rather than a fixed list prepared before fabrication.

I chose this method for four main reasons:

- To reduce dependence on manual quality control decisions.
- To spread radiographic testing more evenly throughout production.
- To reduce the risk of shipment pressure influencing inspection decisions.
- To encourage the same level of care for every weld.

Planning NDT activities was important. However, my main priority was welding quality.

## 6. The FIFO-Based Radiographic Testing Algorithm

In the ERP application I developed, I used the FIFO (First In, First Out) principle.

In this application, FIFO meant checking welds in the order in which they were completed.

Each piping line had its own required RT percentage, based on project requirements. The algorithm checked each line independently.

Whenever a weld was completed, the ERP algorithm used three main pieces of information:

- The total number of completed welds on the line.
- The number of welds that had received radiographic testing on the line.
- The required RT percentage for that line.

The current RT percentage was calculated as follows:

**Current RT percentage = (Number of welds inspected by RT / Number of completed welds) × 100**

The system compared the current percentage with the required percentage for the line.

If the current percentage was below the required percentage, the system created an RT request for the newly completed weld.

If the current percentage was equal to or higher than the required percentage, no new RT request was created under this percentage-based rule.

The process was repeated every time another weld was completed.

The algorithm followed these steps:

1. A weld is completed.
2. The system identifies its piping line.
3. The system reads the total number of completed welds on the line.
4. The system reads the number of welds already inspected by RT.
5. The system calculates the current RT percentage.
6. The system compares it with the required percentage for the line.
7. If the requirement is not met, the system creates an RT request for the newly completed weld.
8. The process starts again when the next weld is completed.

In this way, RT requests were based on production progress rather than a fixed selection list prepared before fabrication.

## 7. How Did the Algorithm Work?

Imagine a piping line with a required RT percentage of 10%.

### The First Weld

When the first weld is completed, no radiographic testing has been carried out yet.

- Completed welds: 1
- Welds inspected by RT: 0
- Current RT percentage: 0%
- Required RT percentage: 10%

The current percentage is below the requirement, so the ERP algorithm creates an RT request for the first weld.

After the inspection is completed, the current RT percentage becomes 100%.

### The Second Weld

When the second weld is completed, the total number of completed welds increases to two. The number of welds inspected by RT remains one.

**Current RT percentage = (1 / 2) × 100 = 50%**

This is above the required 10%, so no RT request is created for the second weld.

### The Third Weld

When the third weld is completed, the current RT percentage becomes:

**(1 / 3) × 100 = 33.33%**

The requirement is still met, so no RT request is created for the third weld.

### The Tenth Weld

As production continues, the number of completed welds increases and the current RT percentage gradually falls.

When the tenth weld is completed:

**(1 / 10) × 100 = 10%**

The line still meets its required RT percentage, so no new request is created.

### The Eleventh Weld

When the eleventh weld is completed:

**(1 / 11) × 100 = 9.09%**

The current percentage is now below the required 10%. The ERP algorithm creates an RT request for the eleventh weld.

After the inspection is completed, the number of welds inspected by RT increases to two.

**New RT percentage = (2 / 11) × 100 = 18.18%**

The same process continues as production progresses. When the twenty-first weld is completed, the percentage falls below 10% again and a new RT request is created.

### Step-by-Step Example

| Completed welds | Welds already inspected by RT | Current RT percentage | New RT request |
|---:|---:|---:|---|
| 1 | 0 | 0.00% | Yes |
| 2 | 1 | 50.00% | No |
| 3 | 1 | 33.33% | No |
| 4 | 1 | 25.00% | No |
| 5 | 1 | 20.00% | No |
| 6 | 1 | 16.67% | No |
| 7 | 1 | 14.29% | No |
| 8 | 1 | 12.50% | No |
| 9 | 1 | 11.11% | No |
| 10 | 1 | 10.00% | No |
| 11 | 1 | 9.09% | Yes |
| 12 | 2 | 16.67% | No |
| 15 | 2 | 13.33% | No |
| 20 | 2 | 10.00% | No |
| 21 | 2 | 9.52% | Yes |
| 30 | 3 | 10.00% | No |
| 31 | 3 | 9.68% | Yes |

In this example, RT requests are created for welds at the following positions in the completion order:

**1, 11, 21, 31, 41, 51, 61, 71, 81, 91...**

When all 100 welds on the line are completed, ten different welds will have received radiographic testing in this example.

However, these ten welds were not selected before fabrication. They were selected during production, based on completion order and the current RT percentage of the line.

This example assumes that each requested inspection is completed before the next weld is checked and that no additional inspections are required because of welding defects.

An important advantage of this approach is that inspections are spread throughout production, starting with the first weld rather than waiting until the end of fabrication.

## 8. Independent Quality Control for Each Piping Line

An important feature of the algorithm was that each piping line was checked independently according to its own quality control requirements.

Different lines within the same project could have different required RT percentages.

For example:

| Piping line | Required RT percentage | Completion positions selected for RT |
|---|---:|---|
| Line A | 5% | 1, 21, 41, 61, 81... |
| Line B | 10% | 1, 11, 21, 31, 41... |
| Line C | 20% | 1, 6, 11, 16, 21... |
| Line D | 50% | 1, 3, 5, 7, 9... |
| Line E | 100% | Every weld |

These are example percentages and completion positions under the same assumptions used in the previous example.

The ERP algorithm tracked completed welds and inspected welds separately for each line.

Extra inspections on one line did not cover missing inspections on another line.

There was no single project-wide RT percentage in this application. Each line was managed according to its own requirement, from its first completed weld to its last.

The aim was not only to meet the required percentage by the end of fabrication, but also to spread inspections throughout production from the beginning.

## 9. Identifying Welding Quality Problems Early

One important reason for spreading radiographic testing throughout production is to identify possible welding quality problems early.

Imagine a line with 100 welds and a required RT percentage of 10%.

If all ten required inspections are carried out near the end of fabrication, many welds may already be completed when a quality problem is found.

This can lead to additional inspections, weld repairs, rework and shipment delays.

With the method I developed, radiographic testing started with the first completed weld on the line. New inspection requests were created as production continued.

The aim was to identify possible quality problems earlier and allow teams to take action sooner.

This approach was valuable not only for quality management, but also for production costs and project management.

Finding a quality problem early can reduce the risk of that problem continuing into later stages of production.

## 10. Comparing the Two Methods

Both methods have their own advantages and limitations.

| Criteria | Selection before fabrication | Selection after welding |
|---|---|---|
| Advance NDT planning | Easier | More difficult |
| Weld selection | Before fabrication | After welding is completed |
| Advance knowledge of selection | Possible | Final selection has not yet been made |
| Decision method | Pre-selected welds | ERP algorithm |
| Line-based control | Can be planned in advance | Monitored dynamically |
| Review of production progress | Based on the selection plan | Each time a weld is completed |
| Risk of shipment pressure influencing decisions | Potentially higher | Aims to reduce this risk |
| Distribution of inspections | Based on the original plan | Based on weld completion order |
| Main advantage | Easier planning | Dynamic, quality-focused control |

Selecting welds after completion can make it more difficult to plan the exact NDT workload in advance.

However, the general NDT workload can still be estimated using the number of welds and the required RT percentage for each line.

What is not decided in advance is exactly which welds will receive radiographic testing and when.

For me, making quality control decisions as independent as possible from production and shipment pressure was more important than selecting welds in advance.

## 11. The Human Factor in Quality Management

When developing an ERP application, technical requirements are not the only things we need to consider.

We also need to understand how people use the system, how they make decisions and how operational pressure can influence those decisions.

In large industrial projects, delivery dates, costs and production targets can create significant pressure.

However, these pressures should not become more important than quality requirements.

The idea behind my method was not a lack of trust in employees. It was to design a process that supports the right decisions.

I wanted quality control decisions to be based on clear business rules and production data rather than personal choices.

However, this FIFO-based algorithm is not a random sampling method. If people know the algorithm rules and the current status of a line, some inspection decisions may be predicted.

Therefore, the method does not remove every risk of misuse.

Its main purpose was to reduce the risks of selecting welds before fabrication and reduce dependence on manual selection.

A good quality management system should not simply assume that people will always make the right decisions. It should provide processes that support them in making those decisions.

## 12. ERP: From Recording Data to Supporting Quality Management

ERP systems are often seen as systems for recording production, stock, costs and financial transactions.

However, with the right business rules and algorithms, ERP systems can do much more.

In the application I developed, the ERP system:

- Tracked the quality control requirements of each line.
- Monitored the number of completed welds.
- Calculated the current RT percentage for each line.
- Compared current and required inspection percentages.
- Created RT requests using the FIFO principle.
- Reduced dependence on manual weld selection.
- Supported a more even distribution of inspections throughout production.

ERP became more than a system for recording quality control results. It became an active tool for supporting quality management.

This approach did not replace the technical responsibilities of NDT specialists.

Radiographic testing, the review of inspection results, weld acceptance and repair activities remained subject to the relevant quality procedures.

The percentage-based algorithm did not replace mandatory 100% inspections, additional inspections required after welding defects, or any other applicable standards and project requirements.

The role of ERP was to identify line-based radiographic testing needs in a systematic way.

## 13. Conclusion: Managing Quality, Not Just Inspecting It

The application I developed to help improve welding quality in spool fabrication was more than a software development project.

It was a process design that brought together production management, quality control, planning, human behaviour and ERP technology.

Selecting welds before fabrication offered important planning advantages. However, I believed that quality control decisions should be as independent as possible from production and shipment pressure.

For this reason, I chose to develop a FIFO-based ERP algorithm that worked after welding was completed and checked the individual RT requirement of each piping line.

My aim was not to carry out more radiographic tests.

My aim was to:

- Support the required inspections at the right time.
- Spread inspections more evenly throughout production.
- Help identify possible quality problems early.
- Reduce the influence of manual decisions on quality control.
- Contribute to improving welding quality.

A successful quality management system should not only find defects. It should also support processes that help reduce the risk of defects occurring.

This is where the real value of ERP becomes clear.

An ERP system should not only record what a business has done in the past. It should also help the business manage its future work better.

**True welding quality means doing every weld with the same care, whether it will be inspected or not.**

---

**ErsSoft Limited**

We use our industrial ERP experience to develop practical, reliable and sustainable solutions that support real business needs.

*United Kingdom | JD Edwards & Industrial ERP Consulting*

*Manufacturing • Steel • Welding • Spool Fabrication*
