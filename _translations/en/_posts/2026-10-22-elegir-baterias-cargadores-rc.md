---
title: "Choosing an RC LiPo Battery and Charger: Size, Voltage and Capacity"
subtitle: "What to check before buying and how to interpret the numbers without overstating them."
description: "An RC battery and charger guide: compatibility, S, mAh, C, balancing, storage and charger power."
---
Choosing a battery is not about finding the label with the biggest numbers. The video shows what I use and how I relate batteries to the car and charger. Here I organise those criteria and qualify some simplifications in that explanation.

<!--more-->

## It Must Fit and Be Compatible First

I measure the car's available space and check dimensions, restraint, cable exits and connector. A battery protruding from its tray or leaving wires near the transmission is not properly installed just because the body closes.

The connector must suit the equipment and intended use. Changing one requires correct polarity and workmanship; buying the right format avoids adapting a new pack.

## S Means Cells in Series

For conventional LiPo, 2S means two cells in series: 7.4V nominal and up to 8.4V fully charged. For 3S, that is 11.1V nominal and up to 12.6V charged. Respect the voltage accepted by **the entire system**, including motor and ESC.

LiHV uses a different charging limit: support for the same S count is insufficient. Check battery, charger and electronics. The tables in this [Horizon Hobby multi-chemistry charger manual](https://www.spektrumrc.com/ProdInfo/Files/ONXC4101%20Manual-EN.pdf) distinguish LiPo from LiHV; their modes are not interchangeable.

## mAh Expresses Capacity, Not Guaranteed Minutes

More capacity can extend driving time, but also adds weight and changes behaviour. Doubling mAh **does not guarantee double the runtime**: driving, terrain, demand and battery condition matter.

mAh is not a charging-current measurement either. Divide by a thousand to obtain Ah: 5000mAh is 5Ah.

## Interpreting C Ratings

The theoretical calculation is capacity in Ah multiplied by C. For example, 2.2Ah × 35C = 77A according to that rating. Distinguish continuous from burst ratings and treat marketing figures cautiously.

An ESC's current rating does not mean the car constantly draws that current. **Simply matching the battery's C figure to the ESC label is insufficient**. Actual load depends on the system and use; voltage sag, temperature and manufacturer instructions also matter.

## Charging, Balancing and Storage

I use a charger compatible with the chemistry and cell count. For conventional packs I connect power and balance leads according to the manual. The balance port monitors and corrects cell differences; it does not mean all main charging current passes through those thin wires.

As a reference, 1C for a 5Ah battery means 5A. The manufacturer determines the permitted rate. For storage I use the appropriate storage program. The [Gens Ace LiPo guide](https://gensace.de/pages/lipo-battery-guide) covers charging limits, storage and not exceeding 1C without specific authorisation.

## Watts Also Limit the Charger

Required output power is **P = V × I**. Size it using maximum charging voltage, rather than nominal voltage alone.

A conventional 6S LiPo reaches 25.2V: maintaining 10A at that voltage requires about **252W output**, with both charger and supply capable of delivering it. A 200W charger will reduce current sooner. Multi-channel equipment also requires checking how power is shared.

## References from the Video

The links list products from the description. They do not establish compatibility with every car or guarantee current listing contents. For the 124017 specifically, see my [model battery guide]({{ '/manuales/baterias-wltoys-124017/' | relative_url }}).

{% include affiliate_products.html %}
