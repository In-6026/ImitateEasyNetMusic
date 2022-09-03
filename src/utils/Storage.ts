class Storage {
    set(key: string, value: any) {
        localStorage.setItem(key, JSON.stringify(value));
    }
    get(key: string) {
        return JSON.parse(
            localStorage.getItem(key) as string
        )
    }
    clear() {
        localStorage.clear()
    }
    remove(key: string) {
        localStorage.removeItem(key)
    }
    change(key: string, value: any) {
        const keys = key.split('.')
        const Item = JSON.parse(
            localStorage.getItem(keys[0]) as string
        )
        let aim: any
        for (const i of keys.slice(1)) {
            aim = Item[i]
        }
        aim = value;
        localStorage.setItem(keys[0], JSON.stringify(Item));
    }
    reSetArray(key: string, index: number, newValue: any) {
        const arr = this.get(key);
        arr[index] = newValue;
        this.set(key, arr);
    }
}
export default new Storage()