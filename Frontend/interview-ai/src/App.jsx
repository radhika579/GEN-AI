import { RouterProvider } from "react-router-dom"
import { router } from "./app.routes.jsx"

function App() {
  console.log('App component rendering')

  return (
    <RouterProvider router={router}  />
  )
}

export default App
       