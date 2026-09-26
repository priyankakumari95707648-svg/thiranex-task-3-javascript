const KEY="thiranex-task-3-todos";
const form=document.querySelector("#todo-form"),input=document.querySelector("#todo-input");
const list=document.querySelector("#todo-list"),count=document.querySelector("#task-count");
const empty=document.querySelector("#empty-state"),emptyTitle=document.querySelector("#empty-title"),emptyText=document.querySelector("#empty-text");
const filters=document.querySelector(".filters"); let filter="all";
let todos=JSON.parse(localStorage.getItem(KEY)||"[]");
function save(){localStorage.setItem(KEY,JSON.stringify(todos))}
function visible(){return filter==="all"?todos:todos.filter(t=>filter==="active"?!t.completed:t.completed)}
function render(){
 list.innerHTML=""; visible().forEach(t=>{const li=document.createElement("li");li.className="todo-item"+(t.completed?" completed":"");li.dataset.id=t.id;
 const check=document.createElement("button");check.className="check";check.type="button";check.setAttribute("aria-label",t.completed?"Mark active":"Mark completed");check.onclick=()=>toggle(t.id);
 const text=document.createElement("span");text.className="task-text";text.textContent=t.text;
 const actions=document.createElement("div");actions.className="actions";
 const edit=document.createElement("button");edit.className="icon-btn";edit.textContent="Edit";edit.onclick=()=>editTask(t.id);
 const del=document.createElement("button");del.className="icon-btn delete";del.textContent="Delete";del.onclick=()=>remove(t.id);
 actions.append(edit,del);li.append(check,text,actions);list.append(li)});
 const left=todos.filter(t=>!t.completed).length;count.textContent=`${left} ${left===1?"task":"tasks"} left`;
 empty.hidden=visible().length!==0;
 if(!todos.length){emptyTitle.textContent="No tasks yet";emptyText.textContent="Add your first task above."}
 else if(filter==="active"){emptyTitle.textContent="You're all caught up";emptyText.textContent="There are no active tasks."}
 else if(filter==="completed"){emptyTitle.textContent="Nothing completed yet";emptyText.textContent="Complete a task and it will appear here."}
}
form.onsubmit=e=>{e.preventDefault();const text=input.value.trim();if(!text)return;todos.unshift({id:Date.now().toString(),text,completed:false});save();form.reset();render();input.focus()};
function toggle(id){todos=todos.map(t=>t.id===id?{...t,completed:!t.completed}:t);save();render()}
function remove(id){todos=todos.filter(t=>t.id!==id);save();render()}
function editTask(id){const t=todos.find(x=>x.id===id),li=document.querySelector(`[data-id="${id}"]`),span=li.querySelector(".task-text"),i=document.createElement("input");i.className="edit-input";i.value=t.text;span.replaceWith(i);i.focus();i.select();const done=()=>{const v=i.value.trim();if(v)t.text=v;save();render()};i.onkeydown=e=>{if(e.key==="Enter")done();if(e.key==="Escape")render()};i.onblur=done}
filters.onclick=e=>{const b=e.target.closest("[data-filter]");if(!b)return;filter=b.dataset.filter;document.querySelectorAll(".filter").forEach(x=>x.classList.toggle("active",x===b));render()};
document.querySelector("#clear-completed").onclick=()=>{todos=todos.filter(t=>!t.completed);save();render()};render();