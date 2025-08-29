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

## Step 5a — Add quest types (daily / weekly / normal)

**Agent Prompt:**
"Add a type property to quests: normal, daily, or weekly. Update the UI so users can select quest type when creating a new quest. Persist the quest type in localStorage. Do not change streak or combo logic yet."

**Testing Checklist:**

* [*] Can you set a quest as normal, daily, or weekly when creating it?
* [*] Quest type shows correctly in the UI.
* [*] Quest type persists in localStorage after refresh.

---

## Step 5b — Track the current date

**Agent Prompt:**
"Implement automatic date tracking. Store the last active date in localStorage. On app load, detect if the date has changed since last session. Do not reset quests yet, just log to console when a new day is detected."

**Testing Checklist:**

* [*] Last active date is saved in localStorage.
* [*] On refresh, if the day changed, a console message indicates 'new day detected'.
* [*] No quest or streak logic is changed yet.

---

## Step 5c — Reset daily quests on new day

**Agent Prompt:**
"Implement reset behavior for recurring quests:

Daily quests reset automatically when a new day begins.

Weekly quests remain until completed manually.
Remove the old 'End Day' button from the UI since automatic reset is now in place."

**Testing Checklist:**

* [*] Daily quests reset automatically on new day.
* [*] Weekly quests are untouched.
* [*] Normal quests are untouched.
* [*] Daily reset persists correctly in localStorage.

---

## Step 5d — Update streak and combo logic

**Agent Prompt:**
"Update streak and combo logic to work with automatic day tracking:

Daily streak increments only if at least one main quest was completed the previous day.

Combo counts consecutive quests completed within a single day.

Combo resets at the start of each new day."

**Testing Checklist:**

* [*] Streak increments correctly when daily quests were completed the previous day.
* [*] Streak does not increment if none were completed.
* [*] Combo works correctly within a day and resets at midnight/new day.

---

## Step 5e — Persistence and cleanup

**Agent Prompt:**
"Ensure all new properties (quest type, lastActiveDate, streak, combo) are saved and restored correctly from localStorage. Also ensure that the daily streak resets to 0 if no main quests were completed the previous day. Refactor code so state persists across refresh without issues."

**Testing Checklist:**

* [*] All quest types persist across refresh.
* [*] Last active date persists across refresh.
* [*] Streak and combo persist correctly.
* [*] No console errors.

---

## Step 6a — Rank decay (XP loss if no quests done)

**Agent Prompt:**
"Add rank decay: if no main quests were completed yesterday, deduct XP on the next app load. XP should never drop below 0. Log decay events in console for debugging."

**Testing Checklist:**

* [*] XP decreases if no main quests completed yesterday.
* [*] XP never drops below 0.
* [*] Decay event is logged.

---

## Step 6b — Progressive XP scaling

**Agent Prompt:**
"Implement progressive XP scaling. Early levels require small XP, later levels require exponentially more. Store current XP and level in localStorage. Update rank/level display accordingly."

**Testing Checklist:**

* [*] Early levels take less XP.
* [*] Later levels take more XP.
* [*] Level-up works as expected.
* [*] State persists across refresh.

---

## Step 6c — Integrate XP decay with scaling

**Agent Prompt:**
"Combine XP decay and progressive scaling into a single rank system. Ensure XP loss and XP gain both use the same scaling formula. Prepare for future animations/icons but do not implement them yet."

**Testing Checklist:**

* [*] XP gain and loss both respect scaling.
* [*] Levels and XP display correctly.
* [*] Rank system is stable across refresh.
---

## Step 7 — Visual feedback & animations

**Agent Prompt:**
"Add animations and visual cues for XP gain/loss, rank changes, streaks, and combo. Replace rank text with optional icons. Animate XP bar smoothly and trigger effects when ranking up or losing XP. Animate streak and combo when they change."

**Testing Checklist:**

* [*] XP bar animates smoothly on quest completion or XP loss.
* [*] Rank-up shows icon and animation.
* [*] Daily streak and combo counters have visual animations when they update.
* [*] Effects do not break any functionality or localStorage persistence.


---

## Step 7b — Improved Quest Editing UI

**Agent Prompt:**
"Add rank-up and rank-down visuals and feedback: show an icon next to the rank display (⭐ for rank up, ⬇️ for rank down), play a small animation (fade-in/out or bounce) when the rank changes, and display a toast message like "Rank Up!" or "Rank Down." Adjust XP scaling to quadratic progression (XP required = 100 * (rank ^ 2)) and remove the combo bonus entirely so progression feels more balanced. Update the XP bar to reflect this new scaling so progress is clearly visible.  

Improve the quest editing interface so that editing fields are compact and do not overflow the screen. Ensure edit boxes resize properly or stay within card boundaries, and avoid overlapping with other quests.
"

**Testing Checklist:**

* [*] Editing a quest keeps the input box within the quest card.
* [*] Edit fields resize properly without running off-screen.
* [*] Other quests remain visible and unaffected during editing.

---

## Step 8 — Polish and UI Improvements

**Agent Prompt:**
"Rename the 'Combo' label to 'Tasks Completed Today' and update related UI references. Improve rank icons by using a consistent visual style (such as a unified icon set or styled emojis) and ensure each rank tier has a distinct icon. Add validation to prevent creating duplicate quests by checking for an existing quest with the same name before adding or saving."

**Testing Checklist:**

* [ ] "Combo" is consistently renamed to "Tasks Completed Today."
* [ ] Rank icons use a consistent, visually appealing style.
* [ ] Each rank tier has a distinct, recognizable icon.
* [ ] Duplicate quest names are blocked, with a clear error message.
* [ ] Editing and saving quests works normally with validation applied.

---

## Step 9 — Accounts & Authentication (Phase 1)

**Agent Prompt:**
"Introduce basic user accounts with login and logout. Store each user’s quests, streak, XP, and rank separately. Use localStorage keyed by username to persist progress, and add a login screen before showing quests. Allow switching between users."

**Testing Checklist:**

* [ ] Users can create accounts with username + password.
* [ ] Quests, streak, XP, and rank are stored per user.
* [ ] Data persists across app reloads via localStorage.
* [ ] Switching users shows the correct data.
* [ ] Logging out returns to the login screen.

---

## Step 10 — Accounts & Persistence (Phase 2)

**Agent Prompt:**
"Connect account data to a persistent database (SQLite locally, or Supabase/Firebase when deployed). Ensure all quests, streaks, XP, and rank progress are tied to a user account. Add the ability to delete accounts or reset progress."

**Testing Checklist:**

* [ ] User data is stored in a database instead of localStorage.
* [ ] Logging in retrieves the correct quests, streak, XP, and rank.
* [ ] Progress persists across devices (if deployed).
* [ ] Users can delete their account and reset data.
* [ ] No data leaks between accounts.

---

## Step 11 — Advanced UI & Progression

**Agent Prompt:**
"Enhance the progression system and user interface. Add clear rank tiers with visually distinct badges (e.g., Bronze/Silver/Gold). Improve the XP bar with animated fill transitions. Create a profile page summarizing streak, rank, XP progress, and tasks completed today in one view."

**Testing Checklist:**

* [ ] Rank tiers are visually distinct with badges or styled icons.
* [ ] XP bar animates smoothly when gaining XP.
* [ ] Profile page shows streak, rank, XP, and daily tasks clearly.
* [ ] Progression UI updates correctly as tasks are completed.
* [ ] No UI overlap or layout issues occur.

---

**General Testing After Each Step**

* [ ] Add new quests, toggle done, check XP/combo/streak updates correctly.
* [ ] Refresh page → all state persists in localStorage.
* [ ] No console errors.
* [ ] Layout looks good on desktop and mobile.
* [ ] Rank, XP, streak, and combo behave according to the new progressive scaling and decay rules.