import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import SignIn from '@/views/SignIn.vue'
import Main from '@/views/Main.vue'
import Join from '@/views/Join.vue'
import Profile from '@/views/Profile.vue'
import Menu from '@/views/Menu.vue'
import Search from '@/views/Search.vue'
import ProfileData from '@/views/ProfileData.vue'
import SearchUsers from '@/views/SearchUsers.vue'
import PrivateMessage from '@/views/PrivateMessage.vue'


const router = createRouter({
	history: createWebHashHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/',
			name: 'home',
			component: Home,
			meta: { authRequired: false }
		},
		{
			path: '/signin',
			name: 'signin',
			component: SignIn,
			meta: { authRequired: false }
		},
        {
			path: '/join',
			name: 'join',
			component: Join,
			meta: { authRequired: false }
		},
		{
			path: '/main',
			name: 'main',
			component: Main,
			meta: { authRequired: true },
			children: [
				{
					path: '',
					components: {
						leftSidebar: Menu,
						focus: Profile,
						rightSidebar: Search
					},
					meta: { authRequired: true }
				},
				{
					path: '/profiledata',
					components: {
						leftSidebar: Menu,
						focus: ProfileData,
						rightSidebar: Search
					},
					meta: { authRequired: true }
				},
				{
					path: '/search',
					components: {
						leftSidebar: Menu,
						focus: SearchUsers,
						rightSidebar: Menu
					},
					meta: { authRequired: true }
				},
				{
					path:'/user/:userId',
					components: {
						leftSidebar: Menu,
						focus: PrivateMessage,
						rightSidebar: Menu
					},
					props:true,
					meta: { authRequired: true }
				}
			]

		},
		{
            path: '/:catchAll(.*)', 
      		redirect: '/', 
        }
        
	],
})


router.beforeEach((to, from, next) => {
	console.log()
	const isLoggedIn = localStorage.getItem('userLog') !== null;
	console.log('Guard triggered', to.path, 'isLoggedIn:', isLoggedIn);
	
	if (to.meta.authRequired && !isLoggedIn) {
	  next('/'); 
	} else {
	  next();
	}
	});


export default router
