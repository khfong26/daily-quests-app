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

* [*] Quest cards display in a responsive grid layout.
* [*] Buttons, inputs, and quest cards look consistent and are clickable.
* [*] XP bar animates smoothly on quest completion.
* [*] Streak increments only once per day if at least one main quest is completed.
* [*] Combo increases per consecutive quest completed in a single day.
* [*] Fonts, colors, gradient background, and spacing look polished on desktop and mobile.
* [*] XP per quest and XP required to level up scale correctly by rank.

---

## Step 5 — Recurring / daily quests with auto day tracking

**Agent Prompt:**
"Add optional recurring quests: allow users to mark a quest as daily or weekly. Replace the manual End Day button with automatic day tracking: on app load, detect if a new day has started. Reset only daily quests automatically, and weekly que---

## Step 5a — Add quest types (daily / weekly / normal)

**Agent Prompt:**
"Add a type property to quests: normal, daily, or weekly. Update the UI so users can select quest type when creating a new quest. Persist the quest type in localStorage. Do not change streak or combo logic yet."

**Testing Checklist:**

* [ ] Can you set a quest as normal, daily, or weekly when creating it?
* [ ] Quest type shows correctly in the UI.
* [ ] Quest type persists in localStorage after refresh.

---

## Step 5b — Track the current date

**Agent Prompt:**
"Implement automatic date tracking. Store the last active date in localStorage. On app load, detect if the date has changed since last session. Do not reset quests yet, just log to console when a new day is detected."

**Testing Checklist:**

* [ ] Last active date is saved in localStorage.
* [ ] On refresh, if the day changed, a console message indicates 'new day detected'.
* [ ] No quest or streak logic is changed yet.

---

## Step 5c — Reset daily quests on new day

**Agent Prompt:**
"Using the date tracking, automatically reset daily quests when a new day is detected. Weekly and normal quests should remain unchanged. Persist state in localStorage."

**Testing Checklist:**

* [ ] Daily quests reset automatically on new day.
* [ ] Weekly quests are untouched.
* [ ] Normal quests are untouched.
* [ ] Daily reset persists correctly in localStorage.

---

## Step 5d — Update streak and combo logic

**Agent Prompt:**
"Update streak and combo logic to work with automatic day tracking:

Daily streak increments only if at least one main quest was completed the previous day.

Combo counts consecutive quests completed within a single day.

Combo resets at the start of each new day."

**Testing Checklist:**

* [ ] Streak increments correctly when daily quests were completed the previous day.
* [ ] Streak does not increment if none were completed.
* [ ] Combo works correctly within a day and resets at midnight/new day.

---

## Step 5e — Persistence and cleanup

**Agent Prompt:**
"Ensure all new properties (quest type, lastActiveDate, streak, combo) are saved and restored correctly from localStorage. Refactor code so state persists across refresh without issues."

**Testing Checklist:**

* [ ] All quest types persist across refresh.
* [ ] Last active date persists across refresh.
* [ ] Streak and combo persist correctly.
* [ ] No console errors.

---

## Step 6a — Rank decay (XP loss if no quests done)

**Agent Prompt:**
"Add rank decay: if no main quests were completed yesterday, deduct XP on the next app load. XP should never drop below 0. Log decay events in console for debugging."

**Testing Checklist:**

* [ ] XP decreases if no main quests completed yesterday.
* [ ] XP never drops below 0.
* [ ] Decay event is logged.

---

## Step 6b — Progressive XP scaling

**Agent Prompt:**
"Implement progressive XP scaling. Early levels require small XP, later levels require exponentially more. Store current XP and level in localStorage. Update rank/level display accordingly."

**Testing Checklist:**

* [ ] Early levels take less XP.
* [ ] Later levels take more XP.
* [ ] Level-up works as expected.
* [ ] State persists across refresh.

---

## Step 6c — Integrate XP decay with scaling

**Agent Prompt:**
"Combine XP decay and progressive scaling into a single rank system. Ensure XP loss and XP gain both use the same scaling formula. Prepare for future animations/icons but do not implement them yet."

**Testing Checklist:**

* [ ] XP gain and loss both respect scaling.
* [ ] Levels and XP display correctly.
* [ ] Rank system is stable across refresh.
---

## Step 7 — Visual feedback & animations

**Agent Prompt:**
"Add animations and visual cues for XP gain/loss, rank changes, streaks, and combo. Replace rank text with optional icons. Animate XP bar smoothly and trigger effects when ranking up or losing XP. Animate streak and combo when they change."

**Testing Checklist:**

* [ ] XP bar animates smoothly on quest completion or XP loss.
* [ ] Rank-up shows icon and animation.
* [ ] Daily streak and combo counters have visual animations when they update.
* [ ] Effects do not break any functionality or localStorage persistence.

---

## Step 8 — Optional: notifications / reminders

**Agent Prompt:**
"Add optional browser notifications or in-app alerts for incomplete daily quests. Trigger when the user opens the app or at a scheduled time, with permission handling. Ensure it doesn’t interfere with XP/streak/combo calculations or rank decay."

**Testing Checklist:**

* [ ] Notifications trigger correctly for incomplete daily quests.
* [ ] User is prompted for notification permission.
* [ ] Notifications do not break XP, streak, combo, or rank decay logic.
* [ ] Recurring quests and normal quest functionality remain unaffected.

---

## Step 9 — Future: multi-user accounts (later)

**Agent Prompt:**
"Prepare the app for future multi-user support:

Refactor state management to allow multiple users to maintain their own quests, XP, streaks, and combos.

Ensure localStorage or database structure can support multiple accounts.

Leave placeholders for authentication and user switching."

**Testing Checklist:**

* [ ] App structure supports storing separate state per user.
* [ ] No conflicts arise in the current single-user mode.
* [ ] Future account functionality can be added without major refactoring.

---

**General Testing After Each Step**

* [ ] Add new quests, toggle done, check XP/combo/streak updates correctly.
* [ ] Refresh page → all state persists in localStorage.
* [ ] No console errors.
* [ ] Layout looks good on desktop and mobile.
* [ ] Rank, XP, streak, and combo behave according to the new progressive scaling and decay rules.