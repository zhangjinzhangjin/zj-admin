import type Form from "@/components/Form/index.vue";
import type { ElForm } from "element-plus";
import { ref, unref, nextTick } from "vue";
interface FormExpose {
  setValues: (data: Recordable) => void;
  setProps: (props: Recordable) => void;
  delSchema: (field: string) => void;
  addSchema: (formSchema: FormSchema, index?: number) => void;
  setSchema: (schemaProps: FormSetPropsType[]) => void;
  formModel: Recordable;
  getElFormRef: () => ComponentRef<typeof ElForm>;
}
export const useForm = (props?: FormProps) => {
  // 我们自己写的Form组件实例
  const formRef = ref<typeof Form & FormExpose>();
  // element的ElForm实例
  const elFormRef = ref<ComponentRef<typeof ElForm>>();
  /**
   * @param ref Form实例
   * @param elRef ElForm实例
   */
  const register = (
    ref: typeof Form & FormExpose,
    elRef: ComponentRef<typeof ElForm>
  ) => {
    formRef.value = ref;
    elFormRef.value = elRef;
  };
  const getForm = async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const form = unref(formRef);
        if (!form) {
          console.error("当前form未注册. 请调用register方法完成注册");
        }
        resolve(form);
      }, 0);
    });

    // await nextTick()
    // const form = unref(formRef)
    // if (!form) {
    //   console.error('当前form未注册. 请调用register方法完成注册')
    // }
    // return form
  };
  // 一些内置的方法
  const methods: {
    setProps: (props: Recordable) => void;
    setValues: (data: Recordable) => void;
    getFormData: <T = Recordable | undefined>() => Promise<T>;
    setSchema: (schemaProps: FormSetPropsType[]) => void;
    addSchema: (formSchema: FormSchema, index?: number) => void;
    delSchema: (field: string) => void;
  } = {
    setProps: async (props: FormProps = {}) => {
      const form = (await getForm()) as any;
      form?.setProps(props);
    },
    setValues: async (data: Recordable) => {
      const form = (await getForm()) as any;
      form?.setValues(data);
    },
    /**
     * @param schemaProps 需要设置的schemaProps
     */
    setSchema: async (schemaProps: FormSetPropsType[]) => {
      const form = (await getForm()) as any;
      form?.setSchema(schemaProps);
    },
    /**
     * @param formSchema 需要新增数据
     * @param index 在哪里新增
     */
    addSchema: async (formSchema: FormSchema, index?: number) => {
      const form = (await getForm()) as any;
      form?.addSchema(formSchema, index);
    },
    /**
     * @param field 删除哪个数据
     */
    delSchema: async (field: string) => {
      const form = (await getForm()) as any;
      form?.delSchema(field);
    },
    /**
     * @returns form data
     */
    getFormData: async <T = Recordable>(): Promise<T> => {
      const form = (await getForm()) as any;
      return form?.formModel as T;
    },
  };
  props && methods.setProps(props);
  return {
    register,
    elFormRef,
    methods,
  };
};
