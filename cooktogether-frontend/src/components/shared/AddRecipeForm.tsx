// src/components/shared/AddRecipeForm.tsx

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { createRecipe } from '@/services/recipe.service';
import type { Recipe } from '@/services/recipe.service';
import { Trash2 } from 'lucide-react';

const recipeFormSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters.').max(100),
  description: z.string().min(10, 'Description must be at least 10 characters.').max(500),
  prep_time: z.coerce.number().min(1, 'Prep time must be at least 1 minute.'), 
  cook_time: z.coerce.number().min(1, 'Cook time must be at least 1 minute.'), 
  imageUrl: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
  ingredients: z.array(z.object({ value: z.string().min(1, 'Ingredient cannot be empty.') })).min(1, 'At least one ingredient is required.'),
  instructions: z.array(z.object({ value: z.string().min(1, 'Instruction cannot be empty.') })).min(1, 'At least one instruction is required.'),
});

type RecipeFormValues = z.infer<typeof recipeFormSchema>;

interface AddRecipeFormProps {
  onSuccess: (newRecipe: Recipe) => void;
}

export function AddRecipeForm({ onSuccess }: AddRecipeFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<RecipeFormValues>({
    resolver: zodResolver(recipeFormSchema),
    defaultValues: {
      title: '', description: '', prep_time: 0, cook_time: 0, imageUrl: '',
      ingredients: [{ value: '' }], instructions: [{ value: '' }],
    },
  });

  const { fields: ingredientFields, append: appendIngredient, remove: removeIngredient } = useFieldArray({
    control: form.control, name: 'ingredients',
  });

  const { fields: instructionFields, append: appendInstruction, remove: removeInstruction } = useFieldArray({
    control: form.control, name: 'instructions',
  });

  async function onSubmit(data: RecipeFormValues) {
    setIsLoading(true); setError(null);
    try {
      const formattedData = {
        ...data,
        imageUrl: data.imageUrl || undefined,
        ingredients: data.ingredients.map(i => i.value),
        instructions: data.instructions.map(i => i.value),
      };
      const newRecipe = await createRecipe(formattedData);
      onSuccess(newRecipe);
    } catch (err) {
      console.error('Failed to create recipe:', err);
      setError('An error occurred. Please try again.');
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      {/* THIS IS THE KEY CHANGE: The form is now a flex container */}
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col h-full">
        {/* This div will contain all the fields and will be the scrollable area */}
        <div className="flex-grow overflow-y-auto pr-4 -mr-4 space-y-6">
          <FormField control={form.control} name="title" render={({ field }) => ( <FormItem><FormLabel>Title</FormLabel><FormControl><Input placeholder="e.g., Classic Italian Pasta" {...field} /></FormControl><FormMessage /></FormItem> )} />
          <FormField control={form.control} name="description" render={({ field }) => ( <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea placeholder="A short and sweet description..." {...field} /></FormControl><FormMessage /></FormItem> )} />
          <FormField control={form.control} name="imageUrl" render={({ field }) => ( <FormItem><FormLabel>Image URL</FormLabel><FormControl><Input placeholder="https://example.com/image.jpg" {...field} /></FormControl><FormMessage /></FormItem> )} />
          <div className="flex flex-col sm:flex-row gap-4">
            <FormField control={form.control} name="prep_time" render={({ field }) => ( <FormItem className="flex-1"><FormLabel>Prep Time (mins)</FormLabel><FormControl><Input placeholder="e.g., 20" type="number"  {...field} value={field.value === 0 ? '' : field.value} onChange={(e) => field.onChange(e.target.value === '' ? 0 : e.target.valueAsNumber)} /></FormControl><FormMessage /></FormItem> )} />
            <FormField control={form.control} name="cook_time" render={({ field }) => ( <FormItem className="flex-1"><FormLabel>Cook Time (mins)</FormLabel><FormControl><Input placeholder="e.g., 45" type="number" {...field} value={field.value === 0 ? '' : field.value} onChange={(e) => field.onChange(e.target.value === '' ? 0 : e.target.valueAsNumber)} /></FormControl><FormMessage /></FormItem> )} />
          </div>
          <div>
            <FormLabel>Ingredients</FormLabel>
            <div className="space-y-2 mt-2">
              {ingredientFields.map((field, index) => (
                <FormField key={field.id} control={form.control} name={`ingredients.${index}.value`} render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-2"><FormControl><Input placeholder={`Ingredient #${index + 1}`} {...field} /></FormControl><Button type="button" variant="ghost" size="icon" onClick={() => removeIngredient(index)} disabled={ingredientFields.length <= 1}><Trash2 className="h-4 w-4 text-muted-foreground" /></Button></div><FormMessage />
                  </FormItem>
                )} />
              ))}
            </div>
            <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => appendIngredient({ value: '' })}>Add Ingredient</Button>
          </div>
          <div>
            <FormLabel>Instructions</FormLabel>
            <div className="space-y-2 mt-2">
              {instructionFields.map((field, index) => (
                <FormField key={field.id} control={form.control} name={`instructions.${index}.value`} render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-2"><FormControl><Textarea placeholder={`Step #${index + 1}`} {...field} /></FormControl><Button type="button" variant="ghost" size="icon" onClick={() => removeInstruction(index)} disabled={instructionFields.length <= 1}><Trash2 className="h-4 w-4 text-muted-foreground" /></Button></div><FormMessage />
                  </FormItem>
                )} />
              ))}
            </div>
            <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => appendInstruction({ value: '' })}>Add Step</Button>
          </div>
        </div>

        {/* This div is the fixed footer of the form */}
        <div className="flex-shrink-0 pt-6">
          {error && <p className="text-sm font-medium text-destructive mb-4">{error}</p>}
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? 'Submitting Recipe...' : 'Submit Recipe'}
          </Button>
        </div>
      </form>
    </Form>
  );
}