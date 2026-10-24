# FlexCheck Presentation Runbook

The presentation launcher starts the complete Docker Compose stack, waits for the API and both frontends, and reports useful diagnostics if something fails. Java, Maven, and Node.js do not need to be installed on the presentation computer.

## Before presentation day

1. Install Docker Desktop and open it once so its initial setup is complete.
2. Copy the complete project folder to the presentation computer.
3. Confirm that the project root contains the prepared `.env` file. Do not commit or share this file publicly.
4. While internet access is available, run the normal launcher once. The first build can take several minutes because Docker may need to download images and dependencies.
5. Complete one check-in and checkout rehearsal.
6. Stop the stack with the stop command below. Do not add `--volumes`; the supplied stop scripts preserve database volumes.

## Windows

Open the project folder and double-click:

```text
scripts\start-demo.cmd
```

Or run it from PowerShell at the project root:

```powershell
.\scripts\start-demo.ps1
```

After a successful first build, use the faster mode when rehearsing or presenting:

```powershell
.\scripts\start-demo.ps1 -SkipBuild
```

When finished:

```text
scripts\stop-demo.cmd
```

## macOS

Open Terminal in the project root and run:

```bash
bash scripts/start-demo.sh
```

After a successful first build, use the faster mode:

```bash
bash scripts/start-demo.sh --skip-build
```

When finished:

```bash
bash scripts/stop-demo.sh
```

## Ready URLs

Unless the ports were changed in `.env`, the launcher prints these addresses:

- Kiosk: `http://127.0.0.1:3000`
- Admin portal: `http://127.0.0.1:3001`
- API gateway health: `http://127.0.0.1:8088/gateway/health`

Open the kiosk and admin portal in separate browser tabs. Keep the Docker Desktop window available so container status can be checked quickly.

## If startup fails

The launcher waits up to five minutes and then prints container status and recent logs. Common fixes are:

- Open Docker Desktop and wait until its engine is running.
- Check that `.env` contains the correct Oracle and admin credentials.
- Confirm that the configured Oracle database is reachable from the presentation network.
- Close software already using ports `3000`, `3001`, or `8088`.
- Run the normal launcher without the skip-build option if the source code changed.

To inspect the stack manually:

```bash
docker compose ps
docker compose logs --tail 100
```

## Important offline note

The first build is not guaranteed to work without internet access because Docker may need base images and Maven/npm dependencies. Run a full build on the actual presentation computer before presentation day. The `--skip-build`/`-SkipBuild` option avoids rebuilding only after the required FlexCheck images already exist on that computer.

