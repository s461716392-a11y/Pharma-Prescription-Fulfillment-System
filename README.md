# Pharma Prescription Fulfillment Frontend System

## Overview

This is a modular web application for pharmacy staff to manage prescriptions, drugs, pharmacies, and audit logs. All API interactions are mocked with realistic data.

## Tech Stack

- Vue 3 + TypeScript
- Element Plus (UI)
- Pinia (State Management)
- Vite (Build Tool)
- Vue Test Utils + Jest (Testing)
- ESLint + Prettier (Linting/Formatting)
- vite-plugin-mock (API Mocking)

## Setup Instructions

1. Install dependencies:
    ```sh
    npm install --legacy-peer-deps
    ```
2. Start development server:
    ```sh
    npm run dev
    ```
3. Run tests:
    ```sh
    npm run test
    ```
4. Lint code:
    ```sh
    npm run lint
    ```

## Mock API Info

- All endpoints are mocked using vite-plugin-mock in the `/mock` directory.
- Endpoints:
    - `GET /api/drugs`, `POST /api/drugs`
    - `GET /api/pharmacies`, `GET /api/pharmacies/:id`
    - `GET /api/prescriptions`, `GET /api/prescriptions/:id`, `POST /api/prescriptions/:id/fulfill`
    - `GET /api/audit-logs`

## Features

- Drug Management: List, add, validate, and mark expired drugs
- Pharmacy Management: List and view allocated drugs
- Prescription Dashboard: View, validate, and fulfill prescriptions
- Audit Logs: View, filter, and inspect logs

## Scripts

- `npm run dev` — Start development server
- `npm run test` — Run unit tests
- `npm run lint` — Lint code

## Assumptions

- All API data is mocked; no backend required
- Form validation and error handling are implemented for all forms
- State management uses Pinia
- UI is built with Element Plus
- Business rules for fulfillment and expiry are enforced in mocks

## Directory Structure

- `src/components` — Main UI components
- `mock` — Mock API handlers

## Author & License

See commit history for contributors. MIT License.
