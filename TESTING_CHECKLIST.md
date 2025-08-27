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

* [*] Each quest is now displayed using `QuestCard` component.
* [*] Toggle, edit, delete functionality still works as before.
* [*] XP, combo, streak updates correctly when completing quests.
* [*] No console errors related to props or state.

---

## Step 4 — Improve layout, styling, and XP system

**Agent Prompt:**
"Enhance the UI layout using Tailwind: make the quest list a responsive grid, add spacing and rounded cards, animate streak/combo changes, and enhance the XP bar with smooth transitions. Implement an updated XP system:

Daily streak counts consecutive days with at least one completed main quest.

Combo counts consecutive quests completed within a day.

Increase XP required to level up progressively by rank.

Reduce XP per quest slightly.

Keep dark gradient background and readable fonts."

**Testing Checklist:**

* [ ] Quest cards display in a responsive grid layout.
* [ ] Buttons, inputs, and quest cards look consistent and are clickable.
* [ ] XP bar animates smoothly on quest completion.
* [ ] Streak increments only once per day if at least one main quest is completed.
* [ ] Combo increases per consecutive quest completed in a single day.
* [ ] Fonts, colors, gradient background, and spacing look polished on desktop and mobile.
* [ ] XP per quest and XP required to level up scale correctly by rank.

---

## Step 5 — Recurring / daily quests with streak effects

**Agent Prompt:**
"Add optional recurring quests: allow users to mark a quest as daily or weekly. On resetDay, reset only the daily quests automatically, and weekly quests remain until manually completed. Update streak and combo logic to account for completed main quests. Persist state in localStorage."

**Testing Checklist:**

* [ ] Can you mark quests as daily or weekly?
* [ ] Clicking End Day resets only daily quests.
* [ ] Weekly quests remain until completed manually.
* [ ] Daily streak increments correctly only if at least one main quest is completed.
* [ ] Combo resets at the start of each new day.
* [ ] State persists correctly after refresh.

---

## Step 6 — Rank decay / penalties

**Agent Prompt:**
"Implement rank decay: if the user misses a day without completing any main quests, deduct XP from the total. Ensure the XP never drops below 0. Future XP required to level up should scale exponentially with rank. Adjust rank/level display to reflect XP changes."

**Testing Checklist:**

* [ ] XP decreases if no main quests are completed in a day.
* [ ] Rank and level update correctly after XP deduction.
* [ ] XP cannot drop below 0.
* [ ] Level-up requires progressively more XP as ranks increase.
* [ ] Combo and streak are unaffected except for missed day streak logic.

---

## Step 7 — Optional: notifications / reminders

**Agent Prompt:**
"Add optional browser notifications or in-app alerts for incomplete daily quests. Trigger when the user opens the app or at a scheduled time, with permission handling. Ensure it doesn’t interfere with XP/streak/combo calculations or rank decay."

**Testing Checklist:**

* [ ] Notifications trigger correctly for incomplete daily quests.
* [ ] User is prompted for notification permission.
* [ ] Notifications do not break XP, streak, combo, or rank decay logic.
* [ ] Recurring quests and normal quest functionality remain unaffected.

---

**General Testing After Each Step**

* [ ] Add new quests, toggle done, check XP/combo/streak updates correctly.
* [ ] Refresh page → all state persists in localStorage.
* [ ] No console errors.
* [ ] Layout looks good on desktop and mobile.
* [ ] Rank, XP, streak, and combo behave according to the new progressive scaling and decay rules.