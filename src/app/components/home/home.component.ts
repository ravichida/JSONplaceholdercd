import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../api.service';
import { FormsModule } from '@angular/forms';

declare var bootstrap: any; // Ensure Bootstrap modal functions work

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  title = 'JSONplaceholdercd';
  posts: any[] = [];
  errorMessage: string = '';
  selectedItem: any = {};
  displayError: string | null = null;
  // allItems: any[] = []; // Assuming you have a list of items to filter from
  constructor(private apiService: ApiService) { }
  ngOnInit() {
    this.getPosts();
  }
  getPosts() {
    this.apiService.getPosts().subscribe((data: any) => {
      this.posts = data;
    });
  }

  openUpdateModal(item: any): void {
    this.selectedItem = { ...item };
    console.log('Selected item for update:', this.selectedItem);
    // Initialize the modal using Bootstrap
  }

  openDeleteModal(item: any): void {
    this.selectedItem = { ...item };
  }

  updateItem(): void {
    const trimmedTitle = (this.selectedItem.title ?? '');
    const trimmedBody = (this.selectedItem.body ?? '');
    console.log('Trimmed title:', trimmedTitle);
    console.log('Trimmed body:', trimmedBody);

    if (!trimmedTitle || !trimmedBody) {
      this.displayError = 'Both Title and Body are required';
      this.clearErrorMessageAfterDelay();
      return;
    } else {
      this.displayError = null; // Clear error message if validation passes
      const updatedData = {
        title: trimmedTitle,
        body: trimmedBody
      };

      this.apiService.updatePost(this.selectedItem.id, updatedData).subscribe(
        (response) => {
          console.log('Update response:', response);
          const index = this.posts.findIndex(item => item.id === this.selectedItem.id);
          if (index !== -1) {
            this.posts[index] = { ...response };
            // console.log('Updated data:', updatedData);
            this.selectedItem = {}; // Close the modal after updating

            this.displayError = 'Item updated successfully';
            this.clearErrorMessageAfterDelay(); // Clear error message after a delay

            const modalEl = document.getElementById('updateModal');
            if (modalEl) {
              const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
              modal.hide();
            }
          }
        });

      // this.getPosts(); // Refresh the posts after update


    }






  }
  
  deleteItem(): void {
    if (!this.selectedItem.id) {
      this.displayError = 'Item ID is missing';
      this.clearErrorMessageAfterDelay();
      return;
    }

    this.apiService.deletePost(this.selectedItem.id).subscribe((response) => {
        // console.log('Delete response:', response);
        const index = this.posts.findIndex(item => item.id === this.selectedItem.id);
        if (index !== -1) {
          console.log('Delete response:', index);
          this.posts.splice(index, 1); // Remove the deleted item from the list
          this.selectedItem = {}; // Close the modal after deleting

          this.displayError = 'Item deleted successfully';
          this.clearErrorMessageAfterDelay(); // Clear error message after a delay

          }
        });
        
        const modalEl = document.getElementById('deleteModal');
        if (modalEl) {
          const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
          modal.hide();
        }
  }
   

  clearErrorMessageAfterDelay(): void {
    setTimeout(() => {
      this.displayError = null;
    }, 10000);
  }

}
