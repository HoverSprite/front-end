
# Hoversprite - Frontend

## Overview

This is the frontend for a session booking, order management, and sprayer assignment system designed for use in agriculture. The system allows three types of users—Farmers, Receptionists, and Sprayers—to interact and manage their respective tasks, from placing orders to completing payments. Below is a step-by-step guide for setting up and navigating the system.

## Setup

1. **Installation**:
   - Clone the repository to your local machine.
   - Install node js.
   - Run `npm install` to install the necessary dependencies.
   
2. **Start the application**:
   - Run `npm start`.
   - Go to `localhost:3000` to access the app.

## User Flow

### 1. **Book a Session**
   - Navigate to `localhost:3000`.
   - Click on **Book a Session**.
   - You will be redirected to the **Sign In** page. If you're a new user, click on **Sign Up** at the bottom of the page.
   - **Sign Up**: Enter a valid email (ending in `.com` or `.vn`, otherwise suggestions will be shown), and a password that meets the criteria: 
     - At least 8 characters long.
     - Contains at least 1 uppercase letter, 1 special character, 1 number, and letters.
   - After signing up, fill in your name, phone number, home address, and email address.

### 2. **Create an Order (Farmer)**
   - Once registered, click on **Book a Session** to navigate to the **Create Order** page.
   - Select your crop type, area (in square meters), and the preferred time and date for the service.
   - Place your order, and you will receive a confirmation notification that your order has been placed.
   - You can also view and modify your orders on the **Order Management** page. Use the **View (eye)** icon to see details, make a payment, or check the QR code for payment.

### 3. **Order Management (Farmer)**
   - Navigate to the **Order Management** page to view all your orders.
   - You can edit the crop type and farm area for each order by clicking the **View (eye)** icon.
   - This icon will also allow you to access payment options, display the QR code, and make payments via card.

### 4. **Create an Order (Receptionist)**
   - As a Receptionist, you can place an order on behalf of a Farmer.
   - On the **Create Order** page, input the Farmer’s phone number. If the phone number exists in the system, the details will be pre-filled. Otherwise, you will need to fill them in manually.
   - Place the order, and both the Farmer and Receptionist will receive notifications and emails about the new order.
   - In the **Order Management** page, Receptionists can manage and confirm orders. The **View (eye)** icon lets you access order details, including payment options and assignment of sprayers.

### 5. **Automatic Sprayer Assignment (Receptionist)**
   - On the **Order Management** page, Receptionists can turn on the automatic sprayer assignment slider for any order.
   - If the slider is enabled, the system will automatically assign the best available Sprayer for that task.
   - Receptionists also have the option to manually confirm the order created by the Farmer.

### 6. **Sprayer Workflow**
   - Sprayers will see all their assigned orders on the **Order Management** page.
   - If they don’t want to receive automatic assignments (e.g., they're on vacation or have exclusive tasks), they can disable automatic assignment on the **Order Management** page.
   - Once an order is assigned, the Sprayer can check the route to the farm by clicking on the **Route** option in the navbar.
   - During the spray session, the Sprayer can update the status of the order to **In Progress**, and once the job is done and payment is received, mark the order as **Completed**.

### 7. **Payments and QR Codes**
   - After a spray order is completed, Sprayers can access the payment section on the **Order Management** page. 
   - Click on the **View (eye)** icon, then the QR code icon at the top right to generate a QR code for the payment.
   - Farmers can also use the **View (eye)** icon in their **Order Management** page to open the payment section and scan the QR code for payment.
   - Farmers will have the additional option of making the payment via card if they prefer.

### 8. **Order Management Overview**
   - On the **Order Management** page:
     - **Farmers** can see the list of all orders they’ve made.
     - **Receptionists** can view orders placed by all Farmers, manage them, and confirm the ones that are ready.
     - **Sprayers** can see the orders assigned to them and manage their work accordingly.

## Future Updates

- Additional features such as customizable notifications, advanced reporting, and enhanced user permissions are planned for future releases.
