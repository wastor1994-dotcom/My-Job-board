// --- รอให้ HTML โหลดเสร็จก่อนเริ่มทำงาน ---
document.addEventListener('DOMContentLoaded', () => {

    // --- ส่วนของข้อมูล (DATABASE) ---
    // ข้อมูลเริ่มต้น สามารถเพิ่ม/แก้ไขตรงนี้ได้เลย
    let jobsData = [
        {
            id: 1,
            location: "ชลบุรี",
            title: "ช่างซ่อมบำรุง",
            workplace: "นิคมอมตะ ชลบุรี",
            schedule: "จันทร์ - ศุกร์ 08.00 - 17.00 น.",
            description: "ดูแลและบำรุงรักษาเครื่องจักร อุปกรณ์ โครงสร้างพื้นฐาน ระบบควบคุมสิ่งแวดล้อม",
            requirements: "เพศชาย, วุฒิ ปวส.ขึ้นไป, อายุ 25-30 ปี, เข้าใจระบบบำบัดน้ำเสียและรีไซเคิ้ลน้ำ RO,DI",
            salary: "19,000 บาท ไม่รวม OT"
        },
        {
            id: 2,
            location: "กรุงเทพ",
            title: "ประชาสัมพันธ์",
            workplace: "Onebangkok",
            schedule: "เข้างานตามเวลาห้าง 4 วันหยุด 3 วัน หรือ 6 วันหยุด 1 วัน",
            description: "งานประชาสัมพันธ์และการตลาด",
            requirements: "เพศหญิง, วุฒิ ปริญญาตรี ขึ้นไป, อายุ 21-35 ปี",
            salary: "18,500 - 21,000 บาท"
        }
        // เพิ่มตำแหน่งงานอื่นๆ ต่อตรงนี้ได้เลย
    ];
    let nextJobId = jobsData.length > 0 ? Math.max(...jobsData.map(j => j.id)) + 1 : 1;
    let editingJobId = null;

    // --- ส่วนของการอ้างอิงถึง HTML Elements ---
    const jobsGrid = document.getElementById('jobsGrid');
    const jobCount = document.getElementById('jobCount');
    const jobForm = document.getElementById('jobForm');
    const submitBtnText = document.getElementById('submitBtnText');
    const clearBtn = document.getElementById('clearBtn');
    const adminPanel = document.getElementById('adminPanel');
    const toggleAdminBtn = document.getElementById('toggleAdminBtn');
    const toggleBtnText = document.getElementById('toggleBtnText');
    
    // --- ส่วนของฟังก์ชัน (FUNCTIONS) ---

    // ฟังก์ชันสร้างการ์ด HTML จากข้อมูล 1 ชิ้น
    function createJobCardHTML(job) {
        return `
            <div class="job-card" data-job-id="${job.id}">
                <div class="job-header">
                    <h3 class="job-title">${job.title}</h3>
                    <p class="job-location">${job.location}</p>
                </div>
                <div class="job-body">
                    <div class="detail-section">
                        <p class="detail-title">สถานที่ปฏิบัติงาน:</p>
                        <p class="detail-content">${job.workplace}</p>
                    </div>
                    <div class="detail-section">
                        <p class="detail-title">เวลาทำงาน:</p>
                        <p class="detail-content">${job.schedule}</p>
                    </div>
                    <div class="detail-section">
                        <p class="detail-title">ลักษณะงาน:</p>
                        <p class="detail-content">${job.description}</p>
                    </div>
                    <div class="detail-section">
                        <p class="detail-title">คุณสมบัติผู้สมัคร:</p>
                        <p class="detail-content">${job.requirements}</p>
                    </div>
                </div>
                <div class="job-footer">
                    <div class="salary">${job.salary}</div>
                    <div class="job-actions">
                        <button class="btn-edit" data-id="${job.id}">✏️ แก้ไข</button>
                        <button class="btn-delete" data-id="${job.id}">🗑️ ลบ</button>
                        <a href="https://s.siamrajathanee.dev/u/feadedrc" target="_blank" class="apply-btn">สมัครงาน</a>
                    </div>
                </div>
            </div>
        `;
    }

    // ฟังก์ชันวาดการ์ดทั้งหมดลงบนหน้าเว็บ
    function renderJobs() {
        if (jobsData.length === 0) {
            jobsGrid.innerHTML = '<p>ยังไม่มีตำแหน่งงานว่างในขณะนี้</p>';
        } else {
            jobsGrid.innerHTML = jobsData.map(createJobCardHTML).join('');
        }
        updateJobCount();
    }

    // ฟังก์ชันอัปเดตตัวเลขจำนวนงาน
    function updateJobCount() {
        jobCount.textContent = jobsData.length;
    }


    // ฟังก์ชันล้างฟอร์ม
    function clearForm() {
        jobForm.reset();
        editingJobId = null;
        submitBtnText.textContent = '➕ เพิ่มงานใหม่';
    }
    
    // ฟังก์ชันจัดการการกดปุ่มบนการ์ด (แก้ไข/ลบ)
    function handleCardActions(event) {
        const target = event.target;
        
        // ปุ่มแก้ไข
        if (target.classList.contains('btn-edit')) {
            const jobId = parseInt(target.dataset.id);
            const jobToEdit = jobsData.find(j => j.id === jobId);
            if (jobToEdit) {
                // เติมข้อมูลลงในฟอร์ม
                document.getElementById('location').value = jobToEdit.location;
                document.getElementById('title').value = jobToEdit.title;
                document.getElementById('workplace').value = jobToEdit.workplace;
                document.getElementById('schedule').value = jobToEdit.schedule;
                document.getElementById('description').value = jobToEdit.description;
                document.getElementById('requirements').value = jobToEdit.requirements;
                document.getElementById('salary').value = jobToEdit.salary;
                
                // เปลี่ยนสถานะเป็นโหมดแก้ไข
                editingJobId = jobId;
                submitBtnText.textContent = '💾 บันทึกการแก้ไข';
                adminPanel.scrollIntoView({ behavior: 'smooth' });
            }
        }
        
        // ปุ่มลบ
        if (target.classList.contains('btn-delete')) {
            const jobId = parseInt(target.dataset.id);
            if (confirm('คุณแน่ใจหรือไม่ที่จะลบตำแหน่งงานนี้?')) {
                jobsData = jobsData.filter(j => j.id !== jobId);
                renderJobs();
            }
        }
    }
    
    // --- ส่วนของการเชื่อมต่อกับ Event (EVENT LISTENERS) ---
    
    // จัดการการ submit ฟอร์ม
    jobForm.addEventListener('submit', (event) => {
        event.preventDefault();
        
        const formData = {
            location: document.getElementById('location').value.trim(),
            title: document.getElementById('title').value.trim(),
            workplace: document.getElementById('workplace').value.trim(),
            schedule: document.getElementById('schedule').value.trim(),
            description: document.getElementById('description').value.trim(),
            requirements: document.getElementById('requirements').value.trim(),
            salary: document.getElementById('salary').value.trim(),
        };

        if (editingJobId) {
            // โหมดแก้ไข
            const jobIndex = jobsData.findIndex(j => j.id === editingJobId);
            if (jobIndex > -1) {
                jobsData[jobIndex] = { id: editingJobId, ...formData };
            }
        } else {
            // โหมดเพิ่มใหม่
            const newJob = { id: nextJobId++, ...formData };
            jobsData.push(newJob);
        }
        
        renderJobs();
        clearForm();
    });

    // ปุ่มล้างฟอร์ม
    clearBtn.addEventListener('click', clearForm);

    // ปุ่มซ่อน/แสดงแผงจัดการ
    toggleAdminBtn.addEventListener('click', () => {
        adminPanel.classList.toggle('hidden');
        const isHidden = adminPanel.classList.contains('hidden');
        toggleBtnText.textContent = isHidden ? '🔼 แสดงแผงจัดการ' : '🔽 ซ่อนแผงจัดการ';
    });
    
    // จัดการการคลิกที่การ์ด (ใช้ Event Delegation)
    jobsGrid.addEventListener('click', handleCardActions);

    // --- ส่วนของการเริ่มต้น (INITIALIZATION) ---
    // วาดหน้าเว็บครั้งแรกเมื่อโหลดเสร็จ
    renderJobs();
});