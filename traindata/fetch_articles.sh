#!/bin/bash
if [ -z "$API_KEY" ]; then
  echo "API_KEY is not set."
  exit 1
fi

HEADERS="accept: application/vnd.forem.api-v1+json"
HEADER_API_KEY="api-key: $API_KEY"

SAVE_DIR="./articles"
mkdir -p $SAVE_DIR

fetch_articles() {
  url="https://dev.to/api/articles?per_page=20"
  if [ -n "$TAG" ]; then
    url="$url&tag=$TAG"
  fi
  response=$(curl -s -H "$HEADERS" -H "$HEADER_API_KEY" $url)
  echo $response
}

fetch_article_body() {
  article_id=$1
  url="https://dev.to/api/articles/$article_id"

  response=$(curl -s -H "$HEADERS" -H "$HEADER_API_KEY" $url)
  echo $response
}

save_articles() {
  articles=$1
  index=1
  echo $articles | jq -c '.[]' | while read -r article; do
    article_id=$(echo $article | jq -r '.id')
    article_body=$(fetch_article_body $article_id)
    body=$(echo $article_body | jq -r '.body_markdown')
    echo "$body" > "$SAVE_DIR/$index.txt"
    index=$((index + 1))
  done
}

articles=$(fetch_articles)
save_articles "$articles"
echo "Articles have been saved."
