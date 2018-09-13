import thunk from 'redux-thunk';
import { applyMiddleware, createStore, Middleware, Store } from 'redux';
import { persistReducer, persistStore } from 'redux-persist';
import { PublicSiteStoreState, publicSiteReducer } from './public_site_reducer';
import logger from 'redux-logger';
// @ts-ignore
import storage from 'redux-persist/lib/storage'

let publicStore: Store<PublicSiteStoreState>;

const persistConfig = {
	key: 'root',
	storage,
	blacklist: ['ixoStore']
}

export function createPublicSiteStore(this: any, preloadedState?: PublicSiteStoreState): any {
	const middlewares: Middleware[] = [thunk];
	middlewares.push(logger);
	const persistedReducer = persistReducer(persistConfig, publicSiteReducer)
	publicStore = createStore.call(this, persistedReducer, preloadedState, applyMiddleware(...middlewares));
	let persistor = persistStore(publicStore)
	return { store: publicStore, persistor }
}

export function getPublicStore(): Store<PublicSiteStoreState> {
	return publicStore;
}

export function getInitializedStoreState(): PublicSiteStoreState {
	return createPublicSiteStore().getState();
}
