import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useStateContext } from '../contexts/ContextProvider'

export const useAuthStatus = () => {
  const [loggedIn, setLoggedIn] = useState(false)
  const [checkingStatus, setCheckingStatus] = useState(true)
  const { activeMenu, setactiveMenu } = useStateContext();

  const { user } = useSelector(state => state.auth)

  useEffect(() => {
    if (user) {
      setLoggedIn(true)
      setactiveMenu (true)
    } else {
      setLoggedIn(false)
     
    }
    setCheckingStatus(false)
  }, [user])
  return { loggedIn, checkingStatus }
}
