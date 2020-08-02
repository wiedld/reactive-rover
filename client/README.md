## What is this thing?

The wandering Mars Rover. Started as a coding challenge (to do OOP style). That original code lives in `src/robot/logic/logic.ts`.

Then people kept asking about react hooks. Since I had already used other attempts to cleanly manage side effects (see Approach #1 below), understand the need, and therefore decided to play with hooks.


## Managing a centralized source of truth

This repo is an experiment in managing state without a centralized source. (See next section.) Here is a a quick recap of my current biases/experiences/IMHO-could-be-wrong when it comes to managing a centralized state tree (e.g. redux).

* redux action creators are a great or terrible thing. Depends on use.

* thunks are about microtasks (async/await), which can block up the event loop.

* if you play it loose with the thunking and action creators, you may create some unexpected serialization of state updates.

* redux-sagas force you to use mostly macrotasks, but then you need to carefully manage the atomicity. e.g. make atomic transactions/actions in your state management, which have the ability to be reversible if things go wrong (e.g. an API call fails). And make sure you build watchers for when things go wrong (& other error handling). Important note: Your ability to make the state changes be reversible, is a key factor for not needing serialization of your sagas (thereby allowing you to use macrotask-producing generators). Background on sagas: https://redux-saga.js.org/docs/introduction/SagaBackground.html

* All of the above is about state management over a centralized source of truth in your frontend. How about the state management across the DOM? And other ways to think about it (without the state centralization)?


## Managing state in the DOM

First time using react hooks. It seems that there are a few key concepts to keep in mind when planning for state management.

#### Approach #1: Redux as a central source of truth

Pre-hook world traditionally used a centralized redux tree, and all unidirection flow from this tree (into the unidirection react rendering) could be done as follows:

1. selectors in mapStateToProps, which directly accesses the redux centralized state.

2. using react class PureComponents or functional components, using all state as derived from props.

3. re-rendering was therefore limited to any changes in props only (and state derived from props). Therefore, the internal state *should* never get out of sync with the centralized redux source.

This ^^ was my previous go-to method. (Plus being careful of 3rd party UI libs with internal state.)


#### Approach #2: Managing all state through react hooks (no centralization).

Key concepts to keep in mind:

1. re-using the same hook will share state.

2. when a component is re-mounted due to a parent re-rendering, then the hook will be re-created. Then it's a question of how you set initState for the hook.

3. be very intentionally aware of hook shared state, and when a hooks inits, if you are putting hooks inside a component that is mounted based on a list (e.g. `values.map(v => <MyComponent key={v.key} {...v} />)`).

4. entirely separated hook states may impact each other using PubSub (see react docs).

5. but the hook state, and the corresponding PubSubs, only exist after the component is initialized.

6. Warning: hooks are mounted (and initialized) in a tree format, matching your react tree abstract. Hooks can then do PubSub, which is a network of connections.

7. The react abstract purposefully makes the componenent lifecycle be based on a series of declarations. (What to do when.) The react hook replaces these declarations, but you need to make sure to:
    * utilize the useEffect() hook with the cleanup() function, to handle mounting and unmounting.
    * be mindful to avoid PubSub cycles. (yeah duh.)
    * keep in mind that the hook state changes will trigger a re-render in the components in which they are used, whenever the state changes (e.g. by a PubSub event).
    * as such, the react render tree + the PubSub networked connections may themselves create a cycle. (okay...I feel dumb now. oops.)

8. If you are managing hook state via a PubSub network, then I recomend figuring out your dependency flow for the state first before dev'ing (e.g. mine was `World -> Robots -> Robot -> UiRobot`). Then keep in mind this dependency chain when building the hooks and their PubSub connections.

9. Try to avoid having more than one interconnected (PubSub connected) hook per component.

Overall, using only state in react hooks + PubSub (without a centralized store) was an interesting concept. The benefits are: (1) use macrotasks (not microtacks) to avoid event loop blockage, (2) to enforce state remains external to render components, and (3) set your state updates as independent watchers (i.e. PubSub and `useEffect()`).

The biggest complexity that is introduced, (if using only PubSub to manage state connections), is keeping in mind both the react DOM tree and the PubSub network. Map those together in your mind.


#### Approach #3: Managing state with react hooks connected to a centralized redux tree.

This approach is to combine the functional components with all state in external hooks, plus the intentional use of a centralized data store via the `useReducer()` hook. The serialization point and src of truth flows out of the centralizied store.

I haven't done this one yet, but have some opinions on how this approach will work out. The react hook initiation will still be tried to the DOM structure (because when it mounts), but you will no longer have to thin about keeping a distributed state (across all the hooks) in sync via a PubSub network. Instead, all the state is centralized in react.

With this scenario, I would likely keep most of the state management within the redux ecosystem, and not the PubSub. I really the atomicity of redux-sagas, which make sure that we do not need to think about serialization. (The state update watchers + error handling rollbacks should make the atomic updates.) But I would need to see how in practice those two parts play together.


## Design choices

Dependency flow = `World -> Robots -> Robot -> UiRobot`:

* world size decided by user. then randomly populate world with hazards.

* new world -> all robots wiped.

* do not want all robots re-rendering (by setting hook state) whenever a single robot changed.

* as much as possible, only re-render the one active robot. then deactivate when creating a new robot (but leave in the DOM).

* deactivated robots become additional hazards.

* when moving, if a robot encounters a hazard -- then it moves back to the last position without a hazard. If the hazard is not on the end goal (location coordinates), then the robot may keep trying to find a path.

* kept the classes Robot and World intact (original coding challenge), with only two minor changes.

* &#9829; wall-e

* free icons sourced from: https://www.flaticon.com/authors/vitaly-gorbachev and https://dribbble.com/iblowyourdesign 

