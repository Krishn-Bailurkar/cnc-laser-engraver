# 🛠️ CNC Laser Engraver Machine

Welcome to the official repository for the **CNC Laser Engraver Machine** project. This is a comprehensive Mechatronics Capstone Project designed to create an adaptable, high-precision, and cost-effective CNC laser engraving platform. 

This repository contains the complete **3D-printable STL model files** for all mechanical components, as well as the project documentation.

---

## 📋 Table of Contents
1. [Project Overview](#-project-overview)
2. [Technical Specifications](#%EF%B8%8F-technical-specifications)
3. [Repository Structure (3D Models)](#%EF%B8%8F-repository-structure-3d-models)
4. [Hardware & Bill of Materials (BOM)](#-hardware--bill-of-materials-bom)
5. [Assembly & Fabrication Guide](#-assembly--fabrication-guide)
6. [Software & Control Configuration](#-software--control-configuration)
7. [Testing & Validation](#-testing--validation)

---

## 🌟 Project Overview

Our goal was to design and develop a CNC (Computer Numerical Control) laser engraver machine capable of engraving various materials such as **wood, acrylic, leather, and metal**. 

The design is built on three core pillars:
*   **Accuracy:** Intricate and high-speed motion control.
*   **Repeatability:** Consistent engraving results across multiple production runs.
*   **Efficiency & Adaptability:** No proprietary hardware/software; customizable to any size or shape.

---

## ⚙️ Technical Specifications

### 📏 Workspace & Dimensions
*   **Engraving Area (Workspace):** $700\text{ mm} \times 700\text{ mm} \times 50\text{ mm}$ ($X, Y, Z$ axes)
*   **Table Size:** $970\text{ mm} \times 979\text{ mm}$ (Outer edges of feet)
*   **Total Machine Footprint:** $1072\text{ mm} \times 1081\text{ mm} \times 540\text{ mm}$ (Clearance of $680\text{ mm}$ to remove Z-axis)

### ⚡ Electrical & Control System
*   **Laser Module:** 5.5W Diode Laser (Wavelength: $450\text{ nm}$, Input Voltage: 12V DC/AC, Active cooling)
*   **Control Board:** Arduino UNO (ATmega328P microcontroller)
*   **Shield:** Arduino CNC Shield V3
*   **Motor Drivers:** A4988 Stepper Motor Drivers (supports full to $1/16$ microstepping, continuous $1\text{A}$ per phase)
*   **Stepper Motors:** NEMA 17 Stepper Motors (12V DC, $1.2\text{A}$ current, $1.8^\circ$ step angle, $22.2\text{ Oz-in}$ unipolar holding torque)
*   **Power Supply:** Switched-Mode Power Supply (SMPS) 12V $5\text{A}$ ($60\text{W}$ rated power)
*   **Motion Transfer:** GT2 Timing Belts (10mm width, 2mm pitch) driven by 20-tooth aluminum pulleys

---

## 🛠️ Repository Structure (3D Models)

All 3D-printable parts are located in the [`STL/`](file:///d:/Krishn's folder/GitHub/CNC laser engerver/STL) directory. They should be printed with at least **45%+ infill** for strength (Core should be printed at **70% infill**).

| Qty | Part Name | STL File Path | Infill | Key Function |
| :--- | :--- | :--- | :---: | :--- |
| 1 | **Core** | [`STL/Core F .STL`](file:///d:/Krishn's folder/GitHub/CNC laser engerver/STL/Core%20F%20.STL) | 70% | The central carriage holding the Z-axis and laser head assembly. |
| 2 | **Corner Bottom** | [`STL/Corner Bottom F 1.stl`](file:///d:/Krishn's folder/GitHub/CNC laser engerver/STL/Corner%20Bottom%20F%201.stl) / [`F 2.STL`](file:///d:/Krishn's folder/GitHub/CNC laser engerver/STL/Corner%20Bottom%20F%202.STL) | 45% | Main corner mounts anchored to the workbench table. |
| 2 | **Corner Top** | [`STL/Corner Top F1.stl`](file:///d:/Krishn's folder/GitHub/CNC/laser/engerver/STL/Corner%20Top%20F1.stl) / [`F 2.STL`](file:///d:/Krishn's folder/GitHub/CNC/laser/engerver/STL/Corner%20Top%20F%202.STL) | 45% | Secure top caps holding the outer axis rails together. |
| 4 | **Feet** | [`STL/Feet F.STL`](file:///d:/Krishn's folder/GitHub/CNC laser engerver/STL/Feet%20F.STL) | 45% | Bottom mounting brackets that secure legs to the table. |
| 4 | **Corner Leg Lock** | [`STL/Corner Leg Lock F.STL`](file:///d:/Krishn's folder/GitHub/CNC laser engerver/STL/Corner%20Leg%20Lock%20F.STL) | 45% | Clamps that secure the vertical legs into the corner bases. |
| 2 | **Truck** | [`STL/Truck F .STL`](file:///d:/Krishn's folder/GitHub/CNC laser engerver/STL/Truck%20F%20.STL) / [`Truck F.stl`](file:///d:/Krishn's folder/GitHub/CNC laser engerver/STL/Truck%20F.stl) | 45% | Carriage blocks moving along the X and Y axes. |
| 4 | **Truck Clamp** | [`STL/Truck Clamp F .STL`](file:///d:/Krishn's folder/GitHub/CNC laser engerver/STL/Truck%20Clamp%20F%20.STL) | 45% | Secure clamping locks for the rail-bearing trucks. |
| 2 | **Lower Belt Mount** | [`STL/Lower Belt F1.stl`](file:///d:/Krishn's folder/GitHub/CNC laser engerver/STL/Lower%20Belt%20F1.stl) / [`F 2.STL`](file:///d:/Krishn's folder/GitHub/CNC laser engerver/STL/Lower%20Belt%20F%202.STL) | 45% | Bottom belt retention and routing guides. |
| 2 | **Upper Belt Mount** | [`STL/Upper Belt F 1.stl`](file:///d:/Krishn's folder/GitHub/CNC laser engerver/STL/Upper%20Belt%20F%201.stl) / [`F 2.STL`](file:///d:/Krishn's folder/GitHub/CNC/laser/engerver/STL/Upper%20Belt%20F%202.STL) | 45% | Top belt retention and tensioners. |
| 2 | **Core Z Clamp** | [`STL/Core Z Clamp 1 F .STL`](file:///d:/Krishn's folder/GitHub/CNC laser engerver/STL/Core%20Z%20Clamp%201%20F%20.STL) / [`2 F .STL`](file:///d:/Krishn's folder/GitHub/CNC laser engerver/STL/Core%20Z%20Clamp%202%20F%20.STL) | 45% | Holds the vertical Z rails in place on the central core. |
| 3 | **Core Clamp** | [`STL/Core Clamp F .STL`](file:///d:/Krishn's folder/GitHub/CNC laser engerver/STL/Core%20Clamp%20F%20.STL) | 45% | Main clamping block surrounding the core gantry rails. |
| 1 | **Core Clamp Y** | [`STL/Core Clamp Y F .STL`](file:///d:/Krishn's folder/GitHub/CNC laser engerver/STL/Core%20Clamp%20Y%20F%20.STL) | 45% | Y-axis alignment clamp for the core carriage. |
| 1 | **Lower Tool Plate** | [`STL/Lower Tool Plate F.STL`](file:///d:/Krishn's folder/GitHub/CNC laser engerver/STL/Lower%20Tool%20Plate%20F.STL) | 45% | Mount plate for low-profile Z-axis tools/accessories. |
| 1 | **Upper Tool Plate** | [`STL/Upper Tool Plate F .STL`](file:///d:/Krishn's folder/GitHub/CNC laser engerver/STL/Upper%20Tool%20Plate%20F%20.STL) | 45% | Main structural attachment plate for the laser module. |
| 1 | **Z Motor Mount** | [`STL/Z Motor F .STL`](file:///d:/Krishn's folder/GitHub/CNC laser engerver/STL/Z%20Motor%20F%20.STL) | 45% | Mounting plate for the Z-axis stepper motor. |
| 1 | **Z Coupler** | [`STL/Z Coupler F .STL`](file:///d:/Krishn's folder/GitHub/CNC laser engerver/STL/Z%20Coupler%20F%20.STL) | 45% | Rigid coupling to connect Z-motor to the leadscrew. |
| 1 | **Nut Trap** | [`STL/Nut Trap .STL`](file:///d:/Krishn's folder/GitHub/CNC laser engerver/STL/Nut%20Trap%20.STL) | 45% | Traps the leadscrew copper nut for vertical travel. |
| 4 | **Stop Block** | [`STL/Stop Block 25.STL`](file:///d:/Krishn's folder/GitHub/CNC laser engerver/STL/Stop%20Block%2025.STL) | 45% | Limit blocks to prevent over-travel on the axes. |
| 2 | **Wire Darryl** | [`STL/Wire Darryl.STL`](file:///d:/Krishn's folder/GitHub/CNC laser engerver/STL/Wire%20Darryl.STL) | 45% | Spacer block used to perfectly gauge pulley height during assembly. |

---

## 🛒 Hardware & Bill of Materials (BOM)

| Item Description | Quantity | Purpose |
| :--- | :---: | :--- |
| **Nema 17 Stepper Motors (50 OZ-in+)** | 4 (or 5) | Powering the Dual X and Dual Y axes (and optional Z-axis). |
| **GT2 Belt (10mm width)** | 4 | Drive belts for X and Y axes. |
| **GT2 Pulley (20T, 10mm width, 5mm bore)**| 4 | Fitted onto motor shafts to drive belts. |
| **Idler Pulley (20T, 10mm width, 5mm bore)**| 8 | Passive pulleys for belt loops. |
| **608RS Ball Bearings** | 45 | Used in Trucks and Core carriages for smooth rolling on rails. |
| **Arduino UNO + CNC Shield V3** | 1 | Microcontroller brain and expansion board. |
| **A4988 Stepper Drivers** | 4 | Control current supply to steppers. |
| **12V 5A Switched Power Supply (SMPS)** | 1 | Powers control board and stepper motors. |
| **5.5W Diode Laser Module** | 1 | Light/heat source for engraving. |
| **M8x40mm (or 5/16" x 1.5") Bolts & Locknuts**| 44 | Primary truck and carriage structural fasteners. |
| **M5x30mm Screws & Locknuts** | 60 | Base feet, leg locks, and corner clamps. |
| **M3x10mm Screws** | 22 | Motor mounting and minor fixtures. |
| **M2.5x12mm Screws** | 8 | Optional limit switch mounting. |
| **T8 Leadscrew + Copper Nut** | 1 | Z-axis vertical drive. |
| **5mm to 8mm Flexible Coupler** | 1 | Z-motor shaft to leadscrew coupler. |
| **Stainless Steel Rails (25mm OD)** | 4 (outer) + 2 (gantry)| Core linear guide rails. |

---

## 🔨 Assembly & Fabrication Guide

For an in-depth visual step-by-step walkthrough, please refer to the complete capstone document: [report from chapter.pdf](file:///d:/Krishn's folder/GitHub/CNC%20laser%20engerver/report%20from%20chapter.pdf).

### 1. Base Setup (Legs & Corners)
1. Mount the four **Feet** [`STL/Feet F.STL`](file:///d:/Krishn's folder/GitHub/CNC laser engerver/STL/Feet%20F.STL) securely onto a flat workbench using wood screws.
2. Insert vertical steel pipe legs into the feet and lock them in using the **Corner Leg Locks** [`STL/Corner Leg Lock F.STL`](file:///d:/Krishn's folder/GitHub/CNC laser engerver/STL/Corner%20Leg%20Lock%20F.STL) and M5x30mm hardware.
3. Fit the **Corner Bottoms** [`STL/Corner Bottom F 1.stl`](file:///d:/Krishn's folder/GitHub/CNC laser engerver/STL/Corner%20Bottom%20F%201.stl) onto the leg tops.
4. Align, measure, and cross-check the diagonals diagonally (ensure $<1\text{ mm}$ deviation) to secure a perfectly square frame.

### 2. Carriage Trucks & Squaring
1. Assemble the **Trucks** [`STL/Truck F .STL`](file:///d:/Krishn's folder/GitHub/CNC laser engerver/STL/Truck%20F%20.STL) by press-fitting the 608RS bearings using M8x40mm bolts. 
2. Adjust the tension bolts evenly so that the carriage moves smoothly under a 45-degree tilt test.
3. Mount the **Truck Clamps** [`STL/Truck Clamp F .STL`](file:///d:/Krishn's folder/GitHub/CNC laser engerver/STL/Truck%20Clamp%20F%20.STL) loosely.

### 3. Pulleys & Motors
1. Mount the **NEMA 17** motors onto the trucks using M3x10mm screws.
2. Slip the **GT2 Pulleys** onto the motor shafts. Use the **Wire Darryl** [`STL/Wire Darryl.STL`](file:///d:/Krishn's folder/GitHub/CNC laser engerver/STL/Wire%20Darryl.STL) spacer to align the pulley heights relative to the idlers perfectly.
3. Tighten the grab screws onto the flat side of the motor shafts first, using threadlocker (Loctite) if necessary.

### 4. Gantry & Core Assembly
1. Place the central **Core** [`STL/Core F .STL`](file:///d:/Krishn's folder/GitHub/CNC laser engerver/STL/Core%20F%20.STL) onto the center rails.
2. Align the crossing X and Y axis gantry rails. 
3. Square the trucks relative to each corner base, adjusting truck tension bolts by $1/16\text{th}$ increments to get perfect symmetry.

---

## 🔌 Software & Control Configuration

### Firmware
The Arduino UNO is flashed with **GRBL v1.1** firmware, an open-source, high-performance C-based motion controller optimized for AVR microcontrollers.
*   **Supported Features:** Real-time acceleration/deceleration, standards-compliant G-code processing, soft limits, and active home cycle.

### Host Software
We highly recommend **LaserGRBL** (an open-source Windows UI) to run and control the machine:
1. Connect via USB at **115200 Baud Rate**.
2. Load raster designs (BMP, JPEG, PNG) or vector graphics (SVG, DXF).
3. LaserGRBL translates images into clean G-code, handling laser power scaling ($S$-commands) and rapid feeds ($G0/G1$).

---

## 🧪 Testing & Validation

Our validation protocol successfully tested all key functional blocks:
*   **Accuracy Check:** Cross-diagonal measurement error within $\pm0.5\text{ mm}$.
*   **Laser Control:** Verified TTL/PWM power scaling from $0\%$ to $100\%$ intensity on wood and acrylic.
*   **Safety Integration:** Configured emergency stop buttons and active limit switch homing.
*   **Cooling Efficiency:** Forced-air fan cooling keeps the 5.5W laser module at a stable operating temperature below $40^\circ\text{C}$ during intensive 2-hour continuous runs.

---

*Mechatronics Engineering Capstone Project. Built for durability, precision, and open-source accessibility.*
