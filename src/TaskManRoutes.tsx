export const TaskManRoutes = () => <Routes>
  <Route path="/tests" element={<
    TestTab
    adminMode={adminMode}
    tasks={tasks}
    results={state.results}
    tests={tests}
    reposAndBranches={reposAndBranches}
    setRepo={setRepo}
    currentRepo={currentRepo}
    currentBranch={currentBranch} />}
  />

  <Route path="/tests/:id/log.txt" element={<
    TestTab
    adminMode={adminMode}
    tasks={tasks}
    results={state.results}
    tests={tests}
    reposAndBranches={reposAndBranches}
    setRepo={setRepo}
    currentRepo={currentRepo}
    currentBranch={currentBranch}
  // currentTest={currentTest}
  // currentTestResultFile={currentTestResultFile}
  />}
  />


  <Route path="/chatCat/mostRecent" element={
    <ChatCat
      chatCatRooms={chatCatRooms}
      chatCatHuddles={[]}
      users={users}
    >
      <ChatCatPeople users={users} />

    </ChatCat>} />

  <Route path="/chatCat/bySubject" element={
    <ChatCat
      chatCatRooms={chatCatRooms}
      chatCatHuddles={[]}
      users={users}
    >
      <ChatCatConversations users={users} conversations={[]} />

    </ChatCat>} />

  <Route path="/docGal/fs" element={
    <DocGal adminMode={adminMode} setAdminMode={setAdminMode} users={users} >
      <DocGalFs docGalFs={docGalFs} />
    </DocGal>} />

  <Route path="/docGal/db" element={
    <DocGal adminMode={adminMode} setAdminMode={setAdminMode} users={users} >
      <DocGalDb />
    </DocGal>} />

  <Route path="/taskMan/features" element={
    <TaskMan adminMode={adminMode} setAdminMode={setAdminMode} users={users} >
      <Features
        adminMode={adminMode}
        tests={tests}
      />
    </TaskMan>} />

  <Route path="/taskMan/kanban" element={
    <TaskMan adminMode={adminMode} setAdminMode={setAdminMode} users={users} >
      <Kanban
        adminMode={adminMode}
        kanban={kanban}
        tests={tests}
        tasks={tasks}
        openNewColumnModal={() => {
        }}
      />
    </TaskMan>} />

  <Route path="/taskMan/gantt" element={
    <TaskMan adminMode={adminMode} setAdminMode={setAdminMode} users={users} >
      <GanttChart
        adminMode={adminMode}
        tasks={tasks}
        milestones={milestones}
        projects={projects}

        tests={tests} />
    </TaskMan>
  } />
  <Route path="/whoThat/people" element={
    <WhoThat users={users} >
      <Users adminMode={adminMode} users={users} />
    </WhoThat>
  } />

  <Route path="/whoThat/groups" element={
    <WhoThat users={users} >
      <Users adminMode={adminMode} users={users} />
    </WhoThat>
  } />

  <Route path="/whoThat/org" element={
    <WhoThat users={users} >
      <OrgChart adminMode={adminMode} users={users} />
    </WhoThat>
  } />
</Routes>
      </Router >