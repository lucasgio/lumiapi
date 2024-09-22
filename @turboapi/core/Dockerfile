FROM node:20-alpine3.19 AS base

ENV DIR /api
WORKDIR $DIR

FROM base AS dev
ENV NODE_ENV=development

COPY . $DIR/



EXPOSE $PORT
CMD ["npm", "run", "dev"]
