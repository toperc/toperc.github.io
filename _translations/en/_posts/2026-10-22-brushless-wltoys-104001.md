---
title: "Converting the Wltoys 104001 to Brushless: My Sensored Installation"
subtitle: "Motor, ESC, servo and receiver, with an extra complication when reversing the drivetrain."
description: "My Wltoys 104001 brushless conversion: electronics, motor mount, wiring and differential changes for a sensored system."
---
With the [centre differential installed]({{ '/manuales/diferencial-central-wltoys-104001/' | relative_url }}), it was time to replace the **Wltoys 104001** electronics. In this video I install a sensored system and also explain the simpler alternative I had used previously.

<!--more-->

## What Needs Replacing

The conversion requires a brushless motor, compatible ESC, three-wire servo and a receiver that binds to the chosen transmitter. Changing only the motor while retaining all the original electronics is not enough.

I removed the servo, ESC and motor. I reused the servo mounting and checked the arm and screw fit on the replacement. The motor-mount screws were so difficult to remove that I ended up using another mount.

## Two Different Installations

My earlier installation used a budget sensorless system that worked well. The description lists a 60A, 3500KV Surpass combo as an alternative.

For this installation I used a **sensored Hobbywing QuicRun 10BL120 and an 8.5T motor**. Do not confuse that ESC with the 120A Surpass combo linked as an option, or other QuicRun versions sharing part of the name.

At this stage I presented a 33-tooth pinion with the project's spur gear. It belongs to my particular combination, rather than a recommended ratio for any motor, battery or use.

## Rotation Direction Complicated the Installation

With my motor and ESC combination, applying throttle made the car try to reverse. I wanted to retain sensored operation and did not resolve the direction through that ESC's programming.

My solution was to reverse **both axle differentials**, removing internal tabs that prevented that positioning. Modifying the housings only makes sense after checking the specific installation.

**This is not mandatory for every brushless conversion or sensored system.** Check the motor and ESC options before modifying housings. Equally, do not automatically apply the phase-swapping approach used on sensorless systems to one requiring the correct phase/sensor relationship.

Afterwards I checked that both axles drove in the same direction. Reversing only one would make them work against each other.

## Differential Maintenance and Assembly

While dismantled, I cleaned the internals and replaced the lubricant. I used 70,000 cSt silicone at the front and 10,000 cSt at the rear. In the centre I mixed both without a measured ratio, so I cannot state a final viscosity.

I started all screws, tightened progressively and checked rotation. Closing the housings, I also checked mount positions and symmetry; geometry cannot be assumed unchanged after loosening everything.

## Receiver, Soldering and Wiring

On this receiver, steering connects to channel 1 and the ESC to channel 2, checking signal, positive and negative markings. Verify the physical pin positions on each receiver.

My installation required soldering. A faulty joint meant stopping the check and repairing it. At the end I secured the components and kept every cable away from the spur gear and driveshafts before closing.

## What Comes Next

The recording ends with the conversion assembled and bench-checked. **It does not include a complete track test or measured top speed.** Cooling and further testing remain part of the project's development.

See also the [body repaint]({{ '/manuales/pintar-carroceria-wltoys-104001/' | relative_url }}) and [original review]({{ '/reviews/wltoys-104001/' | relative_url }}).

## Parts References

The mount and pinion links include the correction left in a channel comment. The servo retains its Amazon reference; the AliExpress link repeated for several parts remains under review. The two combos are alternatives from the description, rather than two systems fitted to this car.

{% include affiliate_products.html %}
