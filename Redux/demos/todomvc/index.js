/*
 * action 类型
 */

var ADD_TODO = 'ADD_TODO';
var TOGGLE_TODO = 'TOGGLE_TODO';
var SET_VISIBILITY_FILTER = 'SET_VISIBILITY_FILTER';

/*
 * 其它的常量
 */

var VisibilityFilters = {
  SHOW_ALL: 'SHOW_ALL',
  SHOW_COMPLETED: 'SHOW_COMPLETED',
  SHOW_ACTIVE: 'SHOW_ACTIVE'
};

/*
 * action 创建函数
 *  - 将请求数据的action单独拿出来，和用户事件、路由切换等的action分开，作为独立的模块
 */
var actionCreator = {
  addTodo: function (text) {
    return {type: ADD_TODO, text}
  },
  toggleTodo: function (index) {
    return {type: TOGGLE_TODO, index}
  },
  setVisibilityFilter: function (filter) {
    return {type: SET_VISIBILITY_FILTER, filter}
  }
};


// 初始化 state 对象
var initialState = {
  visibilityFilter: VisibilityFilters.SHOW_ALL,
  todos: [
    {
      text: 'Consider using Redux',
      completed: true
    },
    {
      text: 'Keep all state in a single tree',
      completed: false
    }
  ]
};

// reducer，state.todos
function todos(state, action) {
  state = state || [];
  switch (action.type) {
    case ADD_TODO:
    {
      return state.concat([{
        text: action.text,
        completed: false
      }]);
    }
    case TOGGLE_TODO:
      return state.map((todo, index) => {
        if (index === action.index) {
          return Object.assign({}, todo, {
            completed: !todo.completed
          })
        }
        return todo;
      });
    default:
      return state;
  }
}

// reducer，state.visibilityFilter
function visibilityFilter(state, action) {
  state = state || VisibilityFilters.SHOW_ALL;
  switch (action.type) {
    case SET_VISIBILITY_FILTER:
      return action.filter;
    default:
      return state;
  }
}

// 合并各个模块的 reducer
var todoApp = Redux.combineReducers({
  todos: todos,
  visibilityFilter: visibilityFilter
});


var store = Redux.createStore(todoApp, initialState);


actionCreator = Redux.bindActionCreators(actionCreator, store.dispatch);


// 打印初始状态
console.log(store.getState());

// 每次 state 更新时，打印日志
// 注意 subscribe() 返回一个函数用来注销监听器
var unsubscribe = store.subscribe(function () {
    console.log(store.getState())
  }
);

// 停止监听 state 更新
//unsubscribe();






