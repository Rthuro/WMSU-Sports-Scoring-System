import React from "react"
import { Outlet } from "react-router-dom";

export function PublicLayout() {
  return (
    <main>
      <Outlet />
    </main>
  )
}
