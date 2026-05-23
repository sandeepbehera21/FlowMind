# FlowMind Submission Workflow

## Before Recording Or Presenting

1. Confirm `.env` contains:

```env
DEMO_AUTH_ENABLED=true
AI_PROVIDER=groq
GROQ_API_KEY=your-groq-api-key
MONGODB_URI=your-mongodb-uri
FRONTEND_ORIGIN=http://localhost:5173
VITE_API_BASE_URL=http://localhost:4000/api
```

2. Start the backend:

```bash
npm run dev:backend
```

3. Start the frontend:

```bash
npm run dev:frontend
```

4. Open:

```text
http://localhost:5173
```

5. If auth is not configured, choose the demo-mode path on the login page.

## Demo Click Path

1. Click **Continue in demo mode**.
2. Open **Dashboard**.
3. Click **Process Now**.
4. Explain that FlowMind ingests work messages, runs topic clustering, extracts actions, decisions, blockers, scores priority, and stores results in MongoDB.
5. Drag an action card from **To do** to **In progress** to show status updates.
6. Open **Decisions** to show agreed outcomes.
7. Open **Blockers** to show unresolved risks.
8. Open **Standup Hub**, select a team member (e.g. Nisha or Mira), and click **Play Standup Brief** to hear the browser-synthesized voice briefing.
9. Open **Digest** and click **Generate daily digest**.
10. Open **Architecture** to explain the production Microsoft Graph + Azure-ready design.

## Talk Track

FlowMind is not a chatbot. It is a continuous work intelligence layer. In production, it connects to Microsoft 365 through Microsoft Graph for Outlook and Teams. For this demo mode, it uses seeded Microsoft 365-style messages so the full experience works without paid Microsoft or Azure access. The AI pipeline runs through Groq, validates structured outputs, stores insights in MongoDB, and presents the latest pipeline run as an executive work dashboard.

## Final Presentation Order

1. Show the login screen and mention demo mode or Microsoft sign-in.
2. Open Dashboard and click Process Now.
3. Drag one card across the board to show state changes.
4. Open Decisions, Blockers, Digest, and Architecture in that order.
5. Finish by showing the health endpoint and the completed build/lint checks.

## Backup Checks

```bash
npm.cmd run lint
npm.cmd run build
```

Backend health:

```text
http://localhost:4000/health
```

Expected response:

```json
{ "ok": true, "data": { "service": "flowmind-api" } }
```
