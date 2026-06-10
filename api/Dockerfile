FROM node:25.9.0-slim AS base

ENV NPM_HOME="/npm"
ENV PATH="$NPM_HOME:$PATH"

RUN rm -rf /usr/local/bin/yarn \
    && rm -rf /usr/local/bin/yarnpkg
RUN npm install -g corepack

RUN corepack enable

RUN apt-get update -y && apt-get install -y --no-install-recommends openssl \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

# # # # 

FROM base AS builder

COPY package.json package-lock.json ./

RUN id=npm,target=/npm/store npm install --frozen-lockfile

COPY . .

# # # #

FROM base AS runner

COPY --from=builder /home/node/app /home/node/app/

RUN chown -R 1000:1000 /home/node/app/src/database/

USER 1000

EXPOSE 3001

CMD [ "npm", "run", "dev" ]

