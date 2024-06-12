This snippet fetches articles from dev.to and stores them in a text file.

```bash
chmod +x fetch_articles.sh
API_KEY=<YOUR_DEV_TO_API_KEY> ./fetch_articles.sh
```

If tag is specified, only articles with that tag will be fetched. If no tag is specified, all articles will be fetched.

```bash
API_KEY=<YOUR_DEV_TO_API_KEY> TAG=azure ./fetch_articles.sh
```
