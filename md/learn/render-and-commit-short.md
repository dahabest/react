---
title: Render and Commit
---

<Intro>

Before your components are displayed on screen, they must be rendered by React. Understanding the steps in this process will help you think about how your code executes and explain its behavior.

</Intro>

<YouWillLearn>

- What rendering means in React
- When and why React renders a component
- The steps involved in displaying a component on screen
- Why rendering does not always produce a DOM update

</YouWillLearn>

## Step 1: Trigger a render {/_step-1-trigger-a-render_/}

There are two reasons for a component to render:

1. It's the component's **initial render.**
2. The component's (or one of its ancestors') **state has been updated.**

### Initial render {/_initial-render_/}

When your app starts, you need to trigger the initial render. Frameworks and sandboxes sometimes hide this code, but it's done by calling [`createRoot`](/reference/react-dom/client/createRoot) with the target DOM node, and then calling its `render` method with your component:

Try commenting out the `root.render()` call and see the component disappear!

### Re-renders when state updates {/_re-renders-when-state-updates_/}

Once the component has been initially rendered.
