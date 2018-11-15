import thunk from 'redux-thunk';
import { applyMiddleware, createStore, Middleware, Store } from 'redux';
import { persistReducer, persistStore } from 'redux-persist';
import { PublicSiteStoreState, publicSiteReducer } from './public_site_reducer';
import logger from 'redux-logger';
// @ts-ignore
import storage from 'redux-persist/lib/storage';

let publicStore: Store<PublicSiteStoreState>;

const persistConfig = {
	key: 'root',
	storage,
	blacklist: ['ixoStore', 'dynamicsStore']
};

export function createAppStore(this: any, preloadedState?: PublicSiteStoreState): any {
	const middlewares: Middleware[] = [thunk];
	middlewares.push(logger);
	const persistedReducer = persistReducer(persistConfig, publicSiteReducer);
	publicStore = createStore.call(this, persistedReducer, preloadedState, applyMiddleware(...middlewares));
	const persistor = persistStore(publicStore);
	if (__DEV__) {
		// persistor.purge();
	}

	return { store: publicStore, persistor };
}

export function getPublicStore(): Store<PublicSiteStoreState> {
	return publicStore;
}

export function getInitializedStoreState(): PublicSiteStoreState {
	return createAppStore().getState();
}
