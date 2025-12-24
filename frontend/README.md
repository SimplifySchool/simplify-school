# React Frontend

## File Structure

Please divide by feature/route.
For example

```
src/
├── assets/          # Global images, fonts, styles
├── components/      # Shared, reusable UI (Button, Input, Card)
├── features/        # The heart of the app
│   ├── auth/        # Feature folder
│   │   ├── api/     # Login/Register fetch calls
│   │   ├── assets/  # Login-specific images
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── types/
│   │   └── index.ts # Public API for the feature
│   └── timer/
├── hooks/           # Global hooks
├── layouts/         # Page wrappers
├── services/        # Global API clients
└── utils/           # Pure helper functions
```
