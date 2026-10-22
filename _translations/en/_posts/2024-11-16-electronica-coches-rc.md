In this post, I will try to answer your questions about the electronics in an RC car.

<!--more-->

## What Does a Car Need to Work?

I have always been curious about how a radio-controlled car works, from the moment you operate a control on the transmitter until the car starts moving.

RC cars generally consist of two main groups:

- **Electronics:** The electronic components that transmit commands and ultimately send them to the mechanical parts, such as:
  - Battery.
  - Transmitter.
  - Receiver.
  - ESC.
  - Motor.
  - Servo.
- **Mechanical components:** Parts that do not require their own electrical supply, such as:
  - Differentials.
  - Suspension.
  - Arms.
  - CVD driveshafts.
  - Servo saver.

This tutorial focuses on the vehicle's electronics.

## Which Electronic Components Might We Find?

The variety of electronics in a vehicle depends mainly on what you want to use it for. An FPV car, a competition car and a car for bashing will not necessarily have the same setup.

In general, though, the basics we need are:

### Battery

The battery is the RC car's energy source. Batteries come in many types, power ratings and capacities.

LiPo batteries are common. Their voltage is described using the number of cells (S). One cell has a nominal voltage of 3.7V, so a 2S LiPo provides 2 × 3.7V = 7.4V, and a 3S provides 3 × 3.7V = 11.1V.

Capacity is measured in milliamp-hours (mAh). It indicates how much charge a battery can store and, consequently, helps determine how long the car can run before recharging.

Another important value is the C rating, which describes the current the battery is rated to deliver. For example, a 2200mAh 25C battery should not exceed 2200mAh × 25 = 55,000mA (55A). Power is not part of that calculation.

### Transmitter

The transmitter is the RC car's remote control.

There are many different transmitters in the RC world, but they generally serve the same purpose and work in a similar way. They send your actions, such as turning a wheel, pulling a trigger or pressing a button, to the receiver.

The receiver and transmitter must use the same protocol. For example, the transmitter and receiver from a Wltoys RTR car are not necessarily interchangeable with those from a Rlaarlo.

Transmitters use channels as communication paths to send actions to the receiver. The number of things you want to control can therefore be important when choosing a transmitter.

The minimum needed to operate an RC car is two channels:

- **Channel 1:** Steering, operating the servo in either direction.
- **Channel 2:** Throttle and braking, controlling the motor.

### Receiver

As mentioned above, the receiver receives commands from the transmitter over the corresponding channel and sends them to the device connected to it.

Each channel appears on the receiver as a socket or connector. Each connection has three wires:

- **White wire:** Signal.
- **Black wire:** Negative.
- **Red wire:** Positive.

The red and black wires power the connected device, while the signal wire tells it what action to perform.

Receivers operate within a voltage range. When choosing one, we need to consider the voltage required by the connected devices to make sure the supply is suitable. Typical ranges are around 4–11V.

But if all these connectors receive power from the receiver, where does that power come from?

It can enter through one of the channels, which may seem confusing at first. The receiver's power connections allow a supply to feed the shared power rails. In a typical setup, the connected devices consume power, while the ESC supplies power to the receiver.

### ESC

The ESC, or Electronic Speed Controller, is a key part of the RC car's control system.

There are many ESCs, but they can be grouped into two types:

- Brushed.
- Brushless.

The type you need depends on the motor. A brushed motor needs a compatible brushed ESC, and a brushless motor needs a compatible brushless ESC.

Some ESCs are **programmable**: you can adjust internal settings to change how they behave. Common options include:

- Punch: how aggressively power is delivered to the motor.
- Brake force: how strongly the car brakes.
- BEC output: the BEC's output voltage.

The ESC handles three critical operations:

1. Receiving power from the battery.
2. Distributing power through the BEC.
3. Driving the motor.

#### Receiving Power from the Battery

The ESC is generally the only component connected directly to the battery, so its supported voltage matters when choosing one. This is normally expressed as a battery cell range, such as 2–3S or 3–4S. The required ESC depends on the motor and whether the system operates on, for example, 3.7V (1S) or 7.4V (2S).

Current, measured in amperes (A), also matters. Two ESCs may look identical, while one handles 45A and the other 60A. Choosing a 45A ESC for a motor that can draw 120A risks damaging the controller.

#### Distributing Battery Power (BEC)

The BEC, or Battery Eliminator Circuit, is an important ESC feature. As the ESC is usually the device connected to the battery, its BEC also supplies the receiver, which distributes that power to the other connected devices.

In older nitro cars, a separate receiver battery supplied the receiver and the other components directly.

#### Driving the Motor

The ESC receives the throttle command through a receiver channel and drives the motor accordingly.

Brushed ESCs connect to the motor with two wires, while brushless ESCs use three.

## Motor

Motors fall into two categories:

1. Brushed motors.
2. Brushless motors.

Motor speed is commonly described using KV for brushless motors and turns (T) for brushed motors.

There is generally a trade-off between a motor's speed characteristics and its torque characteristics.
