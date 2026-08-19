# FlexCheck Hotel Platform

FlexCheck is a hotel kiosk and administration platform built to make guest check-in, checkout, reservation validation, identity verification, payments, and hotel operations faster and safer. The system combines a vertical kiosk experience for guests with an administration portal for hotel teams, while persisting reservations, stays, payments, operational events, and test data in Oracle.

The project was designed for a hospitality self-service environment. Guests can locate their reservation, validate their identity with document and facial verification, add optional services, pay, receive room access information, and complete checkout with minimal staff intervention. Administrators can monitor hotels, manage test reservations, inspect operational data, and prepare future dashboard workflows.

## Project Functionalities

This repository contains the complete FlexCheck platform:

- Kiosk Home: Presents the hotel entry point with check-in, checkout, and services options.
- Check-In Lookup: Allows guests to locate an open reservation by CPF, reservation number, or QR code.
- Reservation Summary: Shows the selected reservation before continuing to identity verification.
- Identity Verification: Captures a physical document, validates OCR data against the reservation, captures a selfie, and compares the face with the document.
- Terms and Biometric Consent: Handles stay terms, privacy policy, and biometric authorization directly inside the check-in identity flow.
- Add-On Services: Offers optional services such as breakfast, room upgrade, and late checkout before payment.
- Check-In Payment: Shows reservation totals, selected add-ons, payment method selection, and payment processing.
- Room Access: Presents room, physical key, and facial access instructions after successful check-in.
- Checkout Lookup: Allows guests to find an active stay by CPF or facial verification.
- Checkout Settlement: Shows only open checkout charges, supports payment, and closes the stay.
- Checkout Completion: Confirms the room release, receipt availability, and physical card return.
- Admin Dashboard: Provides hotel context selection, operational dashboard areas, device monitoring, audit views, branding placeholders, and persistent reservation test management.
- Oracle Persistence: Stores reservations, stays, payments, keys, biometric references, hotel data, and operational test data.
- Docker Runtime: Runs the full platform locally with one Docker Compose stack.

## Technologies and Tools Used

- `React 19`: User interface library for the kiosk and administration applications.
- `Vite 6`: Frontend development server and production bundler.
- `TypeScript`: Static typing for the frontend applications.
- `Spring Boot 3.4.5`: Backend service framework.
- `Java 21`: Backend runtime.
- `Maven`: Backend dependency management and multi-service build.
- `Oracle Database`: Main persistence layer.
- `Docker` and `Docker Compose`: Local platform orchestration.
- `Nginx`: Static frontend hosting inside Docker.
- `OCR.space`: OCR provider for document text extraction.
- `CompreFace`: Local face verification provider.

## Libraries and Frameworks Used

- `react-router-dom`: Frontend routing.
- `i18next`, `react-i18next`, and `i18next-browser-languagedetector`: Kiosk internationalization.
- `html5-qrcode`: QR code scanner for reservation lookup.
- `lucide-react`: Icon system used by kiosk and admin UI.
- `Bootstrap` and `Sass`: Supporting frontend styling tools.
- `Spring Web`: REST APIs and service communication.
- `Spring Data JPA`: Oracle persistence.
- `Oracle JDBC`: Oracle database connectivity.

## Project Status

The current check-in, checkout, admin test reservation, Oracle persistence, and Docker runtime flows are implemented and ready for local execution.

## Repository Structure

- `backend`: Spring Boot multi-service backend.
- `frontend`: React/Vite kiosk and admin applications.
- `database`: Oracle schema, seed, reset, verification, and local bootstrap scripts.
- `docs`: Supporting documentation and project assets.
- `infra`: Local infrastructure helpers, including CompreFace scripts.
- `docker-compose.yml`: Full local platform orchestration.
- `.env.example`: Safe environment template for local configuration.

## Access to the Project

In this repository, you have access to all application files, source code, Docker configuration, database scripts, and documentation required to run the platform locally.

Main local URLs when running with Docker:

- Kiosk: `http://127.0.0.1:3000`
- Admin portal: `http://127.0.0.1:3001`
- API gateway: `http://127.0.0.1:8088`
- Check-in service: `http://127.0.0.1:8081`
- Reservation service: `http://127.0.0.1:8082`
- Admin service: `http://127.0.0.1:8085`

## Open and Run the Project

Clone the repository:

```bash
git clone <repository-url>
cd fiap-challenge-flexmedia
```

Create the environment file:

```bash
cp .env.example .env
```

Edit `.env` with your local values. Do not commit `.env`.

Start the full platform:

```bash
docker compose up -d --build
```

Open the applications:

```text
Kiosk: http://127.0.0.1:3000
Admin: http://127.0.0.1:3001
API:    http://127.0.0.1:8088
```

Stop the platform:

```bash
docker compose down
```

Rebuild Docker images when the frontend or backend changes:

```bash
docker compose up -d --build
```

Rebuild from scratch when cached images are stale:

```bash
docker compose build --no-cache
docker compose up -d
```

## Environment Configuration

The project uses a root `.env` file. Start from `.env.example` and replace only the placeholder values.

Required values for normal development:

```env
COMPOSE_PROJECT_NAME=flexcheck
ORACLE_URL=jdbc:oracle:thin:@oracle.fiap.com.br:1521:ORCL
ORACLE_USER=your_oracle_user
ORACLE_PASSWORD=your_oracle_password
JPA_DDL_AUTO=update
JWT_SECRET=change_me_to_a_long_random_value
SENSITIVE_DATA_SECRET=change_me_to_a_long_random_sensitive_data_secret
ADMIN_USERNAME=admin@example.local
ADMIN_PASSWORD=change_me_admin_password
ADMIN_NAME=FlexCheck Administrator
```

Important security notes:

- Never commit `.env`.
- Never place real credentials in README files, source files, SQL examples, or documentation.
- Use long random values for `JWT_SECRET` and `SENSITIVE_DATA_SECRET`.
- Keep `SENSITIVE_DATA_SECRET` stable after data has been created, otherwise encrypted values cannot be decoded later.

## Database

FlexCheck persists data in Oracle. The database scripts are located in `database/oracle`.

Main files:

- `schema.sql`: Creates the Oracle tables.
- `seed.sql`: Inserts demo data.
- `reset.sql`: Removes FlexCheck tables from a development schema.
- `verify.sql`: Checks table and seed data counts.
- `setup_fiap.sql`: Convenience script for manual setup in a FIAP Oracle schema.
- `init`: Bootstrap scripts for the optional local Oracle container.

For FIAP Oracle or any shared Oracle schema, use your own schema credentials and run only the scripts that are safe for your environment.

For a local Oracle container, start the optional profile:

```bash
docker compose --profile oracle-local up -d oracle-db
```

Then configure `.env` for local Oracle:

```env
ORACLE_SYS_PASSWORD=your_local_oracle_sys_password
ORACLE_URL=jdbc:oracle:thin:@oracle-db:1521/FREEPDB1
ORACLE_USER=flexcheck_app
ORACLE_PASSWORD=change_me_local_password
```

## Identity Verification Providers

Document OCR uses OCR.space. Create a free API key and place it in `.env`:

```env
OCR_SPACE_API_KEY=your_ocr_space_key
```

Face verification uses a local CompreFace installation.

Install the local CompreFace bundle:

```powershell
.\infra\compreface\download-compreface.ps1
```

Start CompreFace:

```powershell
.\infra\compreface\start-compreface.ps1
```

Open `http://localhost:8000`, create a Face Verification service, and copy the generated service API key into `.env`:

```env
COMPREFACE_URL=http://host.docker.internal:8000
COMPREFACE_API_KEY=your_compreface_face_verification_key
COMPREFACE_THRESHOLD=85
```

Use `host.docker.internal` when FlexCheck runs in Docker. Use `http://localhost:8000` only when running backend services directly on the host machine.

## Communication with the API

Both frontend applications communicate through the API gateway.

- Docker gateway URL: `http://127.0.0.1:8088`
- Frontend Docker proxy path: `/api/v1`
- Kiosk Docker URL: `http://127.0.0.1:3000`
- Admin Docker URL: `http://127.0.0.1:3001`

For frontend-only development, keep the backend stack running in Docker and use the local Vite servers described in `frontend/README.md`.

For backend-only development, see the detailed service instructions in `backend/README.md`.

## Project Developers

- Bianca Toller
- Bruno Marcelino Guimaraes
