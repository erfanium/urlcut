FROM denoland/deno:1.11.2

EXPOSE 3040

WORKDIR /app
USER deno

COPY deps.ts .
RUN deno cache --unstable deps.ts

ADD . .
RUN deno cache --unstable main.ts
CMD ["run", "--allow-net", "--allow-env", "--unstable", "--location=https://github.com/erfanium/urlcut" ,"main.ts"]
