# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Critical Rules

- **Website UI**: Norwegian language
- **Code**: English (variables, functions, comments)
- **Claude responses**: Always English, regardless of user input language

## Project Overview

Finance app (finans-app) - React SPA with compound interest calculator. 99% AI-written. Deployed to Azure App Service with EasyAuth authentication.

## Commands

```bash
npm run dev      # Start dev server
npm run build    # TypeScript check + Vite build
npm run lint     # ESLint
package.bat      # Build + create deploy/deploy.zip
deploy.bat       # Deploy to Azure (finans.azurewebsites.net)
```

## Stack

- React 19 + TypeScript + Vite
- BeerCSS (Material Design)
- D3 for charts
- React Router for navigation
- Node.js static server for production (server.js)
- Azure App Service with EasyAuth (/.auth/me endpoint)

## Architecture

**Routing** (`App.tsx`): `ProtectedRoute` wrapper checks `/.auth/me` for auth state. Unauthenticated users redirect to `/`.

**Feature structure** (`src/features/`):
- `auth/` - LoginPage, UserInfo (EasyAuth integration)
- `calculator/` - Compound interest calculator with D3 charts
- `dashboard/` - Main dashboard after login

**Deployment**: `package.bat` builds app, copies `server.js` to dist, zips for Azure. `server.js` is a minimal Node server with SPA fallback routing.

## Azure

App: `finans` in resource group `finans-rg`
URL: https://finans.azurewebsites.net
