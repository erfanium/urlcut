import { cryptoRandomString, Espresso } from "./deps.ts";

const app = new Espresso();
const generate = () => cryptoRandomString({ length: 6, type: "url-safe" });

const REDIRECT_URL = Deno.env.get("REDIRECT_URL") ||
  "https://github.com/erfanium/urlcut";

app.route({
  method: "GET",
  url: "/",
  handler(_, reply) {
    reply.redirect(REDIRECT_URL, 301);
  },
});

app.route({
  method: "GET",
  url: "/count",
  handler(_, reply) {
    return localStorage.length;
  },
});

interface GetUrl {
  Params: { id: string };
}

app.route<GetUrl>({
  method: "GET",
  url: "/:id",
  schema: {
    params: {
      type: "object",
      properties: {
        id: { type: "string" },
      },
      required: ["id"],
    },
  },
  handler(request, reply) {
    const redirectUrl = localStorage.getItem(request.params.id);
    if (!redirectUrl) return reply.status(404).send();
    reply.redirect(redirectUrl, 301);
  },
});

interface PostUrl {
  Body: { url: string };
}

app.route<PostUrl>({
  method: "POST",
  url: "/",
  schema: {
    body: {
      type: "object",
      required: ["url"],
      properties: {
        url: { type: "string" },
      },
    },
  },
  handler(req) {
    const id = generate();
    localStorage.setItem(id, req.body.url);
    return { id, url: req.body.url };
  },
});

const listener = Deno.listen({ port: 3040 });
app.serve(listener);
console.log("urlcut is running on port", 3040);
