## This is Folder for Set Cron Job File

### Step by step for use Cron job:

1. Create file with name pattern \*.cron.ts
   e.g post.cron.ts

```typescript
const Run = () => {
    // this logic for cron job
}

export default Run()
```

2. Run Command for build
    ```bash
    bun run build
    ```
3. Run Command for execute cron
    ```bash
    bun run cron:run --name=post
    ```
