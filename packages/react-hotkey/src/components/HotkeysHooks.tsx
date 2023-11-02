import { useContext } from 'react';

import { HotkeysContext } from './HotkeysContext';

export const useHotkeysManager = () => {
	return useContext(HotkeysContext);
};
