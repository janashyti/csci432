import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'
import SignIn from '@/views/SignIn.vue'
import Join from '@/views/Join.vue'
import Main from '@/views/Main.vue'
import Profile from '@/views/Profile.vue'
import NationalParks from '@/views/NationalParks.vue'
import CampGrounds from '@/views/CampGrounds.vue'
import ThingsToDo from '@/views/ThingsToDo.vue'
import Excursions from '@/views/Excursions.vue'
import ExcursionsPage from '@/views/ExcursionsPage.vue'
import TripsPage from '@/views/TripsPage.vue'
import CreateTrip from '@/views/CreateTrip.vue'
import ManageUsers from '@/views/ManageUsers.vue'
import Invites from '@/views/Invites.vue'
import SharedExcursions from '@/views/SharedExcursions.vue'


const router = createRouter({
    history:createWebHashHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path:'/',
            name:'home',
            component:Home,
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
					path: 'nationalparks',
					name: 'nationalparks',
					component: NationalParks,
					meta: { authRequired: true }
				},
				{
					path: 'campgrounds',
					name: 'campgrounds',
					component: CampGrounds,
					meta: { authRequired: true }
				},
				{
					path: 'thingstodo',
					name: 'thingstodo',
					component: ThingsToDo,
					meta: { authRequired: true }
				},
				{
					path: '/profile',
					name: 'profile',
					component: Profile,
					meta: { authRequired: true }
				},
				{
					path: 'excursion',
					components:  {
						leftSidebar: ExcursionsPage,
						focus: Excursions,
						rightSidebar: SharedExcursions
					},
					meta: { authRequired: true }
				},
				{
					path: 'trip',
					components:  {
						leftSidebar: TripsPage,
						focus: CreateTrip
					},
					meta: { authRequired: true }
				},
				{
					path: 'manage',
					component: ManageUsers,
					meta: { authRequired: true }
				},
				{
					path: '/invites',
					component: Invites,
					meta: { authRequired: true }
				}
			]
		}	
    ],
})
 
export default router
