# To Do

## Main App Component
- use Angular material Tabs + Angular Router for swtiching between Charts and About Component

### task-table Component
- Make Rows Data appear on task-table component - DONE
- implement Table scss for better theme styling - DONE
- Add Sorting and Pagination on task-table component - DONE
- Color Task Row Depending on Deadline - DONE
- Color Category, Status , And therat Level Cells depending on level - DONE
- Make table component use @input to take dynamic inputs

## TABLE REDESIGN
- make table only have Title Description Deadline, Options. Hide everything else in an expandable row below
- Make Table Mobile friendly

### Main App Router
- Use Main App Router to see other tables group by status
    - Transition with animations

### task-form Component
- make it Modal - DONE
- Create template - DONE
- use component for creating and editing tasks - DONE
    - Fix POST and PUT Request - DONE
- Implement Finish and Delete Task - DONE

## pieChart Component
- Create PieChart Wrapper Component, that takes data as props/@Input (use chart.js and ng2-charts) - DONE
- Clicking on a Pie Slice should Filter the current table

### stats Component
- create carts dor Cat, Stat, and Threat Level - DONE
- react depending on current table (Do this if multiple tables via router is created)
- Make mobile friendly, add side arrows to swtich between graphs

### Services
- create account/user service/store to store all user credentials
- create allTasks serve to store all tassk, filter/sort on client side

### About Component
- Create About Component,
- static instuctions and show what colored cell means

## Color-Config Component
- In a tab with stats Component
- Colors of Cells can be changed via a Color Mocal input, Changes are saved on the browser via localStorage (explicitly say it). current colors are default


### server
- explore server.ts data fetching with (pg) - DONE

### misc
- create git Hook to check if console commands are in any file
