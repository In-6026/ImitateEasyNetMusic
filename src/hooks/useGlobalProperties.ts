import { ComponentInternalInstance, getCurrentInstance } from 'vue'
export default function useGlobalProperties(propertyName: string = 'all') {
    const { appContext } = getCurrentInstance() as ComponentInternalInstance
    const globalProperties = appContext.config.globalProperties
    return propertyName === 'all' ? { globalProperties } : globalProperties[propertyName]
}