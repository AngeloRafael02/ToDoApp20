# To Do

### Main App Component
- use Angular material Tabs + Angular Router for swtiching between Charts and About Component - IN PROGRESS

### task-table Component
- Make table component use @input to take dynamic inputs

### pieChart Component
- Clicking on a Pie Slice should Filter the current table

### stats Component
- data reacts depending on current table (Do this when multiple tables via router is created)

### Services
- create account/user service/store to store all user credentials
- create allTasks serve to store all tassk, filter/sort on client side
- Create Color Config Service to handle local Colors

### About Component
- Create About Component
- static instuctions and show what colored cell means

### Color-Config Component
- In a tab with stats Component
- Colors of Cells can be changed via a Color Mocal input, Changes are saved on the browser via localStorage (explicitly say it). current colors are default

### Misc
- create git Hook to check if console commands are in any file

# Finished
- Make Rows Data appear on task-table component - DONE
- implement Table scss for better theme styling - DONE
- Add Sorting and Pagination on task-table component - DONE
- Color Task Row Depending on Deadline - DONE
- Color Category, Status , And therat Level Cells depending on level - DONE
- make task-form  Modal - DONE
- Create Modal template - DONE
- use Modal component for creating and editing tasks - DONE
    - Fix POST and PUT Request - DONE
- Implement Finish and Delete Task per task row - DONE
- Create PieChart Wrapper Component, that takes data as props/@Input (use chart.js) - DONE
- create charts dor Cat, Stat, and Threat Level - DONE
- explore server.ts data fetching with (pg) - DONE
- make table only have Title Description Deadline, Options. Hide everything else in an expandable row below - DONE
- Make Table Mobile friendly - DONE
- Make mobile friendly, add side arrows to swtich between graphs - DONE
- Use Main App Router to see other tables group by status - DONE
