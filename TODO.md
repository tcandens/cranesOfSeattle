# TODO

## API
#### Features
* Report confirmation and crane record creation.
* Caching permits into a Redis would be a good idea. Should
be ease to shim into permitModel.
#### QA
* SSL and Letsencrypt is still pretty hack-y in Docker. Certificates must
still be manually refreshed 'god-knows-when' on the remote server.
* Testing must be redone with AVA.

## CLIENT
* Colocate state selectors to ducks.
* Normalize action creators to use 'payload' convention.
* Crane map component.
* React, redux and unit testing.
* Validating jwt from rehydration.
#### Perf
* Code splitting and lazy loading of map and/or map heavy components.
* Server-side rendering; perhaps not worth is if map component can be
properly isolated since it is the most expensive and cannot be rendered
on the server.
