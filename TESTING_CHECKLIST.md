# Daily Quests App – GitHub Agent Workflow & Testing Checklist

---

## Step 1 — Add quest attributes

**Agent Prompt:**
"Update the quest creation UI so users can select an attribute for each quest: physical, mental, career, studying. Store the attribute in the quest state, display it on each quest card with colored tags, and add appropriate Tailwind or CSS styling. Update `toggleQuest` and localStorage to preserve this attribute."

**Testing Checklist:**

* [*] Can you assign **physical / mental / career / studying** attributes when adding quests?
* [*] Are the **colored tags** displayed properly on each quest card?
* [*] Do the attributes **persist in localStorage** after refresh?
* [*] Adding a quest still works correctly (name, type, XP, combo).

---

## Step 2 — Add delete/edit functionality

**Agent Prompt:**
"Add buttons to each quest card for editing the quest name/type/attribute and deleting the quest. Make sure the state updates correctly and changes persist in localStorage. Style the buttons consistently with existing design."

**Testing Checklist:**

* [*] Can you **edit the quest name/type/attribute** and see changes immediately?
* [*] Can you **delete a quest** and remove it from the list?
* [*] Does the deletion/update **persist in localStorage**?
* [*] Other quests remain unaffected when editing/deleting one.

---

## Step 3 — Refactor into QuestCard component

**Agent Prompt:**
"Refactor the quest list so that each quest is rendered using a new `QuestCard` React component. Move the toggle, edit, and delete logic into this component while keeping the parent `App` state intact. Ensure all props are passed properly."

**Testing Checklist:**

* [ ] Each quest is now displayed using `QuestCard` component.
* [ ] Toggle, edit, delete functionality still works as before.
* [ ] XP, combo, streak updates correctly when completing quests.
* [ ] No console errors related to props or state.

---

## Step 4 — Improve layout & styling

**Agent Prompt:**
"Improve the overall UI layout using Tailwind: make the quest list a responsive grid, add spacing and rounded cards, animate streak/combo changes, and enhance the XP bar with smooth transitions. Keep dark gradient background and readable fonts."

**Testing Checklist:**

* [ ] Quest cards display in a responsive **grid layout**.
* [ ] Buttons, inputs, and quest cards **look consistent and are clickable**.
* [ ] XP bar animates smoothly on quest completion.
* [ ] Streak/combo animations trigger correctly.
* [ ] Fonts, colors, gradient background, and spacing look polished on desktop and mobile.

---

## Step 5 — Recurring / daily quests

**Agent Prompt:**
"Add optional recurring quests: allow users to mark a quest as daily or weekly. On `resetDay`, reset only the daily quests automatically, and weekly quests remain until manually completed. Update localStorage accordingly."

**Testing Checklist:**

* [ ] Can you mark quests as **daily or weekly**.
* [ ] Clicking **End Day** resets only daily quests.
* [ ] Weekly quests remain until completed manually.
* [ ] XP, streak, and combo behave correctly after reset.
* [ ] State persists correctly after refresh.

---

## Step 6 — Optional: notifications / reminders

**Agent Prompt:**
"Add optional browser notifications or in-app alerts for incomplete daily quests. Trigger when the user opens the app or at a scheduled time, with permission handling. Ensure it doesn’t interfere with XP/streak calculations."

**Testing Checklist:**

* [ ] Notifications trigger correctly for incomplete daily quests.
* [ ] User is prompted for notification permission.
* [ ] Notifications do not break XP, streak, or combo logic.
* [ ] Recurring quests and normal quest functionality remain unaffected.

---

## General Testing After Each Step

* [ ] Add new quests, toggle done, check XP/combo/streak updates correctly.
* [ ] Refresh page → all state persists in localStorage.
* [ ] No console errors.
* [ ] Layout looks good on desktop and mobile.
