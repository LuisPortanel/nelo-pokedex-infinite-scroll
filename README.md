This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app@latest`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

To run the project, use `yarn`:

```bash
yarn install
# and then
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the Pokedex with Infinite Scroll.

## Dependencies

The project implements cutting edge libraries in its latest versions:

- Next.js 15
- React 19
- Zod Server Actions (ZSA)
- Typescript 5
- Tailwind
- Eslint 9

Instead of hitting directly the PokeAPI from the client, a couple of Server Actions were configured in the backend, which act as proxy and where all the heavy logic resides.

Those Server Actions are implemented with ZSA with Zod to apply validation to the params sent and to also add TS Types to the response of the Server Action.

Tailwind is used with the `@apply` approach to reduce the classes added to the DOM.

The Infinite Scroll logic was implemented with Intersection Observer, by adding a listener element at the end of the list.

The logic was separated into different folders and files, like:

- /types
- /server
- /server/utils
- /app/components
- /utils
- /utils/contants.ts
- etc

## Improvements

The best feature that can be added is cache control, so it doesn't make a call to the Server Action each time.

A simple way to do it, is to implement a useContext and store the response of the getPokemonList and getPokemonDetails. Everytime a request would be made, verify if its information exists in the context and use it instead of calling the Server Action.
