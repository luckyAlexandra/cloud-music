import React from 'react'
import { Provider } from 'react-redux'
import { GlobalStyle } from './style'
import { IconStyle } from './assets/iconfont/iconfont'
import { renderRoutes } from 'react-router-config'
import store from './store/index.js'
import routes from './routes/index.js'
import { HashRouter } from 'react-router-dom'

function App() {
  return (
    <Provider store={store}>
      <HashRouter>
        <GlobalStyle></GlobalStyle>
        <IconStyle></IconStyle>
        { renderRoutes(routes)}
      </HashRouter>
    </Provider>
  )
}

export default App;
