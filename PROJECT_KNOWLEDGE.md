# AKomo Project Knowledge Base

## Project Overview
**Name**: AKomo  
**Type**: Monorepo (Backend + Mobile Application)  
**Root Path**: `/home/jesus/projects/jodaz/OtraAppDelDolarVzla`  

## Architecture Summary

### 1. Mobile Application (`/mobile`)
**Framework**: Expo (React Native)  
**Routing**: Expo Router (File-based routing)  
**Language**: TypeScript  
**Bundle Identifier**: `com.jodaz.akomo`  
**Scheme**: `akomo`

**Key Dependencies**:
- **State Management**: `zustand`
- **Data Fetching**: `@tanstack/react-query`
- **Styling/Icons**: `lucide-react-native`, `@expo/vector-icons`, `@expo-google-fonts/noto-sans`
- **Forms**: `react-hook-form`
- **Utilities**: `date-fns`
- **Navigation**: `@react-navigation/native`

**Configuration**:
- `newArchEnabled`: true
- **Splash Screen**: Custom light/dark themes configured in `app.json`

### 2. Backend API (`/backend`)
**Framework**: NestJS  
**Language**: TypeScript  
**Environment**: Node.js

**Key Dependencies**:
- **Core**: `@nestjs/core`, `@nestjs/common`
- **Database/Auth**: `@supabase/supabase-js` (Supabase integration)
- **HTTP/Scraping**: `axios`, `cheerio` (Likely used for fetching exchange rates/external data)
- **Validation**: `class-validator`, `class-transformer`
- **Testing**: `jest`, `supertest`

**Scripts**:
- `sync:binance`: Script to sync Binance data
- `sync:bcv`: Script to sync BCV (Banco Central de Venezuela) data

## Current State (as of Jan 2026)
- The project appears to be a marketplace or currency rate tracking application ("OtraAppDelDolarVzla" directory name suggests dollar rates, "AKomo" is the new branding).
- **Recent Focus**: UI/UX enhancements, responsive design, and branding updates (renaming to AKomo).
- **Backend Features**: Includes scripts for synchronizing currency logic (Binance, BCV).
- **Authentication**: Project-based API Key system using SHA-256 hashing.

## Key Management

### Project Creation
Authorized clients (like the mobile app) must have a project entry in Supabase and use an `x-api-key` header.

To create a new project:
```bash
pnpm create:project "Project Name" [--test]
```

### Authentication Logic
- **Header**: `x-api-key`
- **Global Guard**: `ProjectAuthGuard` enforces validation on all routes except those marked with `@IsPublic()`.
- **Database Table**: `projects` (uuid, name, key_hash, prefix, is_active, created_at, last_used_at).

## Rules & Standards
- **Package Manager**: `pnpm` (Global preference). `npm` used specifically for syncing mobile `package-lock.json` if needed.
